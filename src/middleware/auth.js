const admin = require('../utils/firebase_admin');
const pool = require('../utils/db');
const { getUserFirebase } = require('../utils/queries/users');

const verifyFirebaseIdToken = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))
        return res.status(401).json({ err: 'Missing/bad Firebase id_token header' });

    try {
        const id_token = req.headers.authorization.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(id_token);

        pool.query(getUserFirebase, [decoded.uid], (q_err, q_res) => {
            if (q_err)
                res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
            else if (!q_res.rows.length)
                res.status(404).json({ err: 'User not found' });
            else {
                req.profile = q_res.rows[0];
                next();
            }
        });
    } catch (err) {
        return res.status(500).json({ err: 'Firebase error: ' + err });
    }
};

const verifyIsAdmin = async (req, res, next) => {
    verifyFirebaseIdToken(req, res, () => {
        if (!req.profile || !req.profile.is_admin)
            return res.status(403).send();
        next();
    });
}

module.exports = {
    verifyFirebaseIdToken,
    verifyIsAdmin,
};
