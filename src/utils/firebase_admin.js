require('dotenv').config();

const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            privateKey: serviceAccount.private_key,
            clientEmail: serviceAccount.client_email,
            projectId: serviceAccount.project_id,
        }),
        datebase_url: process.env.FIREBASE_DATA_URL,
    });
}

export default admin;
