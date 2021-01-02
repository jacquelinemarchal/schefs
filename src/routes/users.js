const { verifyFirebaseIdToken } = require('../middleware/auth');

const express = require('express');
const pool = require('../utils/db');
const queries = require('../utils/users_queries');

const router = express.Router();

/*
 * GET /api/users/{uid}
 * Get information on a single user.
 *
 * Authorization:
 *  Firebase ID Token
 *
 * Request Parameters:
 *  path:
 *    uid <int> required
 *
 * Response:
 *  200: success
 *    uid         <int>
 *    email       <string>
 *    phone       <string>
 *    first_name  <string>
 *    last_name   <string>
 *    img_profile <string>
 *    bio         <string>
 *    school      <string>
 *    major       <string>
 *    grad_year   <int>
 *  500: postgres error
 */
router.get('/:uid', verifyFirebaseIdToken, (req, res) => {
    pool.query(queries.getUser, [ req.params.uid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows[0]);
    });
});

module.exports = router;
