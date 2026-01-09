const admin = require('firebase-admin');
const path = require('path');

const initFirebase = () => {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        try {
            const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
            const serviceAccount = require(serviceAccountPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('Firebase Admin initialized');
        } catch (error) {
            console.error('Error initializing Firebase Admin:', error.message);
        }
    } else {
        console.warn('FIREBASE_SERVICE_ACCOUNT_PATH not found in .env. Firebase Auth will fail.');
    }
};

module.exports = initFirebase;
