const express = require('express');
const pool = require('../utils/db');
const queries = require('../utils/queries/thumbnails');

const router = express.Router();


/*
 * GET /api/thumbnails
 * Get list of available thumbnails for event builder.
 *
 * Response:
 *  200: successfully retrieved
 *    <object>
 *      tid           <int>
 *      location      <string>
 *      is_used	      <boolean>
 *  500: other postgres error
 */
router.get('', (req, res) => {
    pool.query(queries.getThumbnails, (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows);
    });
});


module.exports = router;
