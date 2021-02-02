const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const { createEvent, reserveTicket, createHost } = require('../src/utils/queries/events');
const { uploadThumbnail } = require('../src/utils/queries/thumbnails');
const { getUserFirebase, postSignup } = require('../src/utils/queries/users');

// initialize firebase
const admin = require('firebase-admin');
const serviceAccount = require('/Users/Chris 1/schefs/firebase-credentials.json');
admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        projectId: serviceAccount.project_id,
    }),
    database_url: 'https://schefs.firebaseio.com',
});

const firestore = admin.firestore();
const storage = admin.storage().bucket('schefs.appspot.com');

// initialize postgres
const pool = new Pool({
    user: 'Chris',
    host: 'localhost',
    database: 'schefs',
    password: 'mxUS4Cen',
    port: 5432,
});

const downloadImage = async (file) => {
    const fileurl = file.publicUrl();
    const filename = uuidv4();
    const filepath = path.resolve('../', 'public', 'images', filename);

    await file.download({ destination: filepath });
    return 'images/' + filename;
}

// insert users
firestore.collection('users').get().then((snap) => {
    snap.forEach(async (doc) => {
        try {
            const data = doc.data();
            const fb_uid = doc.id;
            const prefix = 'hostPictures/' + fb_uid;

            // download profile picture
            let prof_path = '';
            try {
                const prof_file = (await storage.getFiles({ prefix }))[0];
                prof_path = await downloadImage(prof_file);
            } catch (err) {
                console.log(err);
            }

            // insert user into postgres
            const values = [
                fb_uid,
                data.email,
                data.phoneNumber,
                data.firstName,
                data.lastName,
                prof_path,
                '', // empty bio
                data.university,
                data.major,
                data.gradYear,
            ];

            await pool.query(postSignup, values);
        } catch (err) {
            console.log(err);
            console.log(doc.id);
        }
    });
}).then(() => {
    firestore.collection('weekendevents').get().then((snap) => {
        snap.forEach(async (doc) => {
            try {
                const data = doc.data();

                // download thumbnail
                const thumb_filename = 'chosenImages' + data.thumb.slice(data.thumb.lastIndexOf('/'));
                const thumb_file = storage.file(thumb_filename);
                const thumb_path = await downloadImage(thumb_file);

                // insert thumbnail into postgres
                const thumb_id = (await pool.query(uploadThumbnail, [ thumb_path ])).rows[0].tid;
                
                // insert event into postgres
                const values = [
                    data.firstName + ' ' + data.lastName,
                    data.university,
                    data.bio,
                    data.title,
                    data.desc,
                    data.req,
                    thumb_id,
                    '', // no zoom link
                    '', // no zoom id
                    data.start_time.toDate(),
                    data.status,
                ];

                const event_id = (await pool.query(createEvent, values)).rows[0].eid;

                // insert host relationship into postgres
                const user_id = (await pool.query(getUserFirebase, [ data.user ])).rows[0].uid;
                await pool.query(createHost, [ user_id, event_id ]);

                // insert tickets into postgres
                const tickets_snap = await doc.ref.collection('tickets').get();
                tickets_snap.forEach(async (ticket_doc) => {
                    try {
                        const ticket_user_id = await pool.query(getUserFirebase, [ ticket_doc.id ]);
                        console.log(ticket_user_id.rows[0]);
                        await pool.query(reserveTicket, [ event_id, ticket_user_id.rows[0].uid ]);
                    } catch (err) {
                        console.log(err);
                    }
                });
            } catch (err) {
                console.log(err);
                console.log(doc.data());
                console.log(doc.id);
            }
        });
    });
});
