const express = require('express');
const pool = require('../utils/db');
const queries = require('../utils/queries/users_queries');

const router = express.Router();

/*
 * GET /api/users
 * List all users.
 * 
 * Response:
 *  200: success
 *    <array[object]>
 *      uid         <int>
 *      email       <string>
 *      phone       <string>
 *      first_name  <string>
 *      last_name   <string>
 *      img_profile <string>
 *      bio         <string>
 *      school      <string>
 *      major       <string>
 *      grad_year   <int>
 *  500: other postgres error
 */
router.get('', (req, res) => {
    // check auth and other stuff here

    pool.query(queries.getUsers, [], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows);
    });
});

/*
 * GET /api/users/{uid}
 * Get user object with specified database eid.
 *
 * Request Parameters:
 *  path:
 *    uid <int> required
 *
 * Response:
 *  200: successfully retrieved
 *    <object>
 *      uid         <int>
 *      email       <string>
 *      phone       <string>
 *      first_name  <string>
 *      last_name   <string>
 *      img_profile <string>
 *      bio         <string>
 *      school      <string>
 *      major       <string>
 *      grad_year   <int>
 *  404: user does not exist
 *  500: other postgres error
 */
router.get('/:uid', (req, res) => {
    // check auth and other stuff here
    pool.query(queries.getUser, [ req.params.uid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else if (!q_res.rows.length)
            res.status(404).json({ err: 'User does not exist: ' + req.params.eid });
        else
            res.status(200).json(q_res.rows[0]);
    });
});

module.exports = router;
