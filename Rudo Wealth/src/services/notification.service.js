const admin = require('firebase-admin');

exports.sendNotification = async (fcmToken, title, body, data = {}) => {
    if (!fcmToken) return;

    const message = {
        notification: {
            title,
            body,
        },
        data,
        token: fcmToken,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent notification:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};
