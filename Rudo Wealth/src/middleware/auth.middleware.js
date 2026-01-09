const admin = require('firebase-admin');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // --- BEGIN MOCK AUTH ---
    if (process.env.NODE_ENV === 'development' && req.headers['x-mock-user']) {
        const mockEmail = req.headers['x-mock-user'];
        let user = await User.findOne({ email: mockEmail });
        if (!user) {
            user = await User.create({
                firebaseUid: `mock_${mockEmail.split('@')[0]}`,
                email: mockEmail,
                displayName: mockEmail.split('@')[0],
                photoURL: 'https://via.placeholder.com/150',
            });
        }
        req.user = user;
        return next();
    }
    // --- END MOCK AUTH ---

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        // Check if user exists, if not create one (sync with Firebase)
        let user = await User.findOne({ firebaseUid: uid });
        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                email: email,
                displayName: name,
                photoURL: picture,
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = { verifyToken };
