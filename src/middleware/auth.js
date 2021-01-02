const admin = require('../utils/firebase_admin');

const verifyFirebaseIdToken = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))
        return res.status(401).json({ err: 'Missing/bad Firebase id_token header' });
    try {
        const id_token = req.headers.authorization.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(id_token);
        req.uid = decoded.uid;
        next();
    } catch (err) {
        return res.status(500).json({ err: 'Firebase error: ' + err });
    }
};

module.exports = {
    verifyFirebaseIdToken,
};
