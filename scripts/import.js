require('dotenv').config();

const GET_ALL_EVENTS = true;

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const { createEvent, reserveTicket, createHost, postComment} = require('../src/utils/queries/events');
const { uploadThumbnail } = require('../src/utils/queries/thumbnails');
const { getUserFirebase, postSignup } = require('../src/utils/queries/users');
const { postOpenMind } = require('../src/utils/queries/openmind');

// initialize firebase
const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        projectId: serviceAccount.project_id,
    }),
    database_url: process.env.FIREBASE_DATA_URL,
    storageBucket: 'schefs.appspot.com',
});

const firestore = admin.firestore();
const storage = admin.storage().bucket();

// initialize postgres
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

// function to download images
const downloadImage = async (file) => {
    const filename = uuidv4();
    const filepath = path.resolve('../', 'public', 'images', filename);

    await file.download({ destination: filepath });
    return 'images/' + filename;
}

const eventImport = async () => {
    console.log("################################ ENTER EVENT ENTRY ################################")
    // insert events
    const snap = await firestore.collection('weekendevents').get()

    const documents = [];
    snap.forEach((doc) => {
        documents.push(doc);
        return false;
    });

    for (const doc of documents) {
        try {
            const data = doc.data();

            // download thumbnail
            let thumb_id = 1;
            try {
                const prefix = data.thumb.slice('gs://schefs.appspot.com/'.length);
                const thumb_file = (await storage.getFiles({ prefix }))[0][0];
                const thumb_path = await downloadImage(thumb_file);

                // insert thumbnail into postgres
                thumb_id = (await pool.query(uploadThumbnail, [ thumb_path ])).rows[0].tid;
            } catch (err) {
                console.log(data.title, doc.id)
                console.log(err);
            }
            if (data.status === "approved"){
                // insert event into postgres
                const values = [
                    data.firstName + ' ' + data.lastName,
                    data.university,
                    data.bio,
                    data.title,
                    data.desc,
                    data.req,
                    thumb_id,
                    data.zoomLink,
                    data.zoomId,
                    '', // no gcal ID
                    data.start_time.toDate(),
                    data.status,
                ];

                const event_id = (await pool.query(createEvent, values)).rows[0].eid;

                // insert host relationship into postgres
                var user_id = (await pool.query(getUserFirebase, [ data.user ])).rows[0]
                user_id = user_id.uid;

                await pool.query(createHost, [ user_id, event_id ]);

                // insert tickets into postgres
                const tickets_snap = await doc.ref.collection('tickets').get();
                tickets_snap.forEach(async (ticket_doc) => {
                    try {
                        const ticket_user_id = (await pool.query(getUserFirebase, [ ticket_doc.id ])).rows[0].uid;
                        await pool.query(reserveTicket, [ event_id, ticket_user_id ]);
                    } catch (err) {
                        console.log(err, data.title);
                    }
                });

                // insert comments into postgres
                const comments_snap = await doc.ref.collection('comments').get();
                if (!comments_snap.empty) {
                    comments_snap.forEach(async (comment_doc) => {
                        try {
                            const comment_data = comment_doc.data();
                            const comment_user = (await pool.query(getUserFirebase, [ comment_data.uid ])).rows[0];
                            const comment_values = [
                                comment_user.uid,
                                comment_data.name,
                                comment_data.content,
                                comment_user.school,
                                event_id,
                            ];

                            await pool.query(postComment, comment_values);
                        } catch (err) {
                            console.log(err);
                        }
                    });
                }
            }
        } catch (err) {
            console.log(err);
            console.log(doc.id);
        }
    };
};

const userImport = async () => {
    console.log("################################ ENTER USERS ENTRY ################################")
    const snap = await firestore.collection('users').get()

    const documents = [];
    snap.forEach((doc) => {
        documents.push(doc);
        return false;
    });

    for (const doc of documents) {
        try {
            const data = doc.data();
            const fb_uid = doc.id;
            const prefix = 'hostPictures/' + fb_uid;

            // download profile picture
            let prof_path = '';
            try {
                const prof_file = (await storage.getFiles({ prefix }))[0][0];
                prof_path = await downloadImage(prof_file);
            } catch (err) {
                // console.log(err);
            }

            // rename gradYear
            if (data.gradYear === '2020' || data.gradYear === '2021' || data.gradYear === '2022' || data.gradYear === '2023')
                data.gradYear === 'Class of ' + data.gradYear;

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
            //console.log(doc.id);
        }
    };
};

const omaImport = async () => {
    console.log("################################ ENTER OMA ENTRY ################################")
    const snap = await firestore.collection('openmind').get()

    const documents = []
    snap.forEach((doc) => {
        documents.push(doc);
        return false;
    });

    for (const doc of documents) {
        try {
            const data = doc.data();
            const user_id = (await pool.query(getUserFirebase, [ data.uid ])).rows[0].uid;
            
            // insert user into postgres
            const values = [
                user_id,
                data.topic,
            ];

            await pool.query(postOpenMind, values);
        } catch (err) {
            console.log(doc.data());
            console.log(err);
        }
    }
}
const main = async () => {
    await userImport();
    await eventImport();
    await omaImport();
}

main();






// insert aug20 festival events
/*firestore.collection('aug20events').get().then((snap) => {
    snap.forEach(async (doc) => {
        try {
            const data = doc.data();

            // download thumbnail
            let thumb_id = 1;
            try {
                const prefix = data.thumb.slice('gs://schefs.appspot.com/'.length);
                const thumb_file = (await storage.getFiles({ prefix }))[0][0];
                const thumb_path = await downloadImage(thumb_file);

                // insert thumbnail into postgres
                thumb_id = (await pool.query(uploadThumbnail, [ thumb_path ])).rows[0].tid;
            } catch (err) {
                console.log(err);
            }
            
            // insert event into postgres
            const values = [
                data.firstName + ' ' + data.lastName,
                data.university,
                data.bio,
                data.title,
                data.desc,
                data.req,
                thumb_id,
                data.zoomLink,
                data.zoomId,
                '', // no gcal ID
                data.time.toDate(),
                'approved'
            ];

            const event_id = (await pool.query(createEvent, values)).rows[0].eid;

            // insert host relationship into postgres
            const user_id = (await pool.query(getUserFirebase, [ data.user ])).rows[0].uid;
            await pool.query(createHost, [ user_id, event_id ]);

            // insert tickets into postgres
            const tickets_snap = await doc.ref.collection('tickets').get();
            tickets_snap.forEach(async (ticket_doc) => {
                try {
                    const ticket_user_id = (await pool.query(getUserFirebase, [ ticket_doc.id ])).rows[0].uid;
                    await pool.query(reserveTicket, [ event_id, ticket_user_id ]);
                } catch (err) {
                    console.log(err);
                }
            });

            // insert comments into postgres
            const comments_snap = await doc.ref.collection('comments').get();
            if (!comments_snap.empty) {
                comments_snap.forEach(async (comment_doc) => {
                    try {
                        const comment_data = comment_doc.data();
                        const comment_user = (await pool.query(getUserFirebase, [ comment_data.uid ])).rows[0];
                        const comment_values = [
                            comment_user.uid,
                            comment_data.name,
                            comment_data.content,
                            comment_user.school,
                            event_id,
                        ];

                        await pool.query(postComment, comment_values);
                    } catch (err) {
                        console.log(err);
                    }
                });
            }

        } catch (err) {
            console.log(err);
            console.log(doc.id);
        }
    });
});
*/
