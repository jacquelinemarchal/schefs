const { verifyFirebaseIdToken } = require('../middleware/auth');
const admin = require('../utils/firebase_admin');

const express = require('express');
const pool = require('../utils/db');
const queries = require('../utils/queries/users');
const { resolveHref } = require('next/dist/next-server/lib/router/router');

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
        else {
            if (req.params.uid === req.uid)
                res.status(200).json(q_res.rows[0]);
            else {
                delete q_res.rows[0].fb_uid;
                delete q_res.rows[0].email;
                delete q_res.rows[0].phone;
                res.status(200).json(q_res.rows[0]);
            }
        }
    });
});

/*
 * POST /api/users/signup
 * Register a user to Firebase auth and in the PSQL database.
 *
 * Request Body:
 *  <object>
 *    email         <string> required
 *    password      <string> required
 *    phone         <string>
 *    first_name    <string> required
 *    last_name     <string> required
 *    img_profile   <string>
 *    bio           <string>
 *    school        <string> required
 *    major         <string> required
 *    grad_year     <int>    required
 * 
 * Response:
 *  201: successfully signed up
 *  406: user already exists and/or missing field
 *  500: other postgres/firebase error
 */
router.post('/signup', async (req, res) => {
    let fb_user;
    try {
        fb_user = await admin.auth().createUser({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.first_name + ' ' + req.body.last_name,
        });
    } catch (err) {
        res.status(500).json({ err: 'Firebase error: ' + err });
        return;
    }

    const values = [
        fb_user.uid,
        req.body.email,
        req.body.phone || '',
        req.body.first_name,
        req.body.last_name,
        req.body.img_profile || '',
        req.body.bio || '',
        req.body.school,
        req.body.major,
        req.body.grad_year,
    ];

    pool.query(queries.postSignup, values, (q_err, q_res) => {
        if (q_err) {
            if (q_err.code === '23505') // unique_violation
                res.status(406).json({ err: 'Someone with this Firebase ID and/or email already exists' });
            else if (q_err.code === '23502') // not_null_violation
                res.status(406).json({ err: 'One or more required field is missing' });
            else
                res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        } else
            res.status(201).send();
    });
});

module.exports = router;
