import firebase from './firebase_client';

const googleProvider = new fireabase.auth.GoogleAuthProvider();

module.exports = {
    googleProvider,
};
