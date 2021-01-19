const { verifyFirebaseIdToken } = require('../middleware/auth');
const admin = require('../utils/firebase_admin');
const upload = require('../utils/multer');

const express = require('express');
const pool = require('../utils/db');
const queries = require('../utils/queries/users');

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
 *    grad_year   <string>
 *  500: postgres error
 */
router.get('/:uid', verifyFirebaseIdToken, (req, res) => {
    if (!req.params.uid) {
	res.status(406).json({ err: 'uid is required' });
	return;
    }

    pool.query(queries.getUser, [ req.params.uid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else {
            if (q_res.rows.length === 0)
		res.status(404).json({ err: 'No such user found' });
	    else if (parseInt(req.profile.uid) === parseInt(req.params.uid))
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
 * GET /api/users/login/{fb_uid}
 * Login and get user information.
 *
 * Authorization:
 *  Firebase ID Token
 *
 * Request Parameters:
 *  path:
 *    fb_uid <string> required
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
 *    grad_year   <string>
 *  500: postgres error
 */
router.get('/login/:fb_uid', verifyFirebaseIdToken, (req, res) => {
    res.status(200).json(req.profile);
});

/*
 * POST /api/users/signup
 * Register a user to Firebase auth and in the PSQL database.
 *
 * Request Body:
 *  <object>
 *    email         <string> required
 *    phone         <string>
 *    first_name    <string> required
 *    last_name     <string> required
 *    img_profile   <string>
 *    bio           <string>
 *    school        <string> required
 *    major         <string> required
 *    grad_year     <string> required
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

/*
 * PUT /api/users/{uid}
 * Update a user's information.
 *
 * Request Parameters
 *  path:
 *    uid <int> required
 *
 * Request Body:
 *  <object>
 *    email         <string>
 *    phone         <string>
 *    first_name    <string>
 *    last_name     <string>
 *    img_profile   <string>
 *    bio           <string>
 *    school        <string>
 *    major         <string>
 *    grad_year     <string>
 *
 * Response:
 *  201: successfully updated
 *  406: uid missing and/or email already exists
 *  500: other postgres error
 */
router.put('/:uid', verifyFirebaseIdToken, upload.single('img_profile'), async (req, res) => {
    if (!req.params.uid) {
	res.status(406).json({ err: 'uid is required' });
    	return;
    }

    if (parseInt(req.profile.uid) !== parseInt(req.params.uid)) {
	console.log(req.profile.uid);
	console.log(typeof req.profile.uid);
	console.log(req.params.uid);
	console.log(typeof req.params.uid);
	res.status(403).json({ err: 'May not update other user profile' });
	return;
    }

    if (!req.file)
	req.file = { filename: null };
    
    const values = [
	req.body.email || null,
	req.body.phone || null,
	req.body.first_name || null,
	req.body.last_name || null,
	req.file.filename || null,
	req.body.bio || null,
	req.body.school || null,
	req.body.major || null,
	req.body.grad_year || null,
	req.params.uid,
    ];

    pool.query(queries.updateUser, values, (q_err, q_res) => {
	if (q_err) {
	    if (q_err.code === '23505') // unique_violation
		res.status(406).json({ err: 'Someone with this email already exists' });
	    else
		res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
	} else
	    res.status(201).send();

    });
});

module.exports = router;
