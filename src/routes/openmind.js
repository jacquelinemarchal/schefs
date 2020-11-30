const express = require('express');
const pool = require('../utils/db');
const queries = require('../utils/queries/openmind_queries');

const router = express.Router();

/*
 * GET /api/openmind
 * List OMA entries within a datetime range, in ascending order by datetime.
 *
 * Request Parameters:
 *  query:
 *    last_id <int> required
 *
 * Response:
 *  200: success
 *    <array[object]>
 *      omid         <int>
 *      user_id      <int>
 *      body         <string>
 *      time_created <Date>
 *  500: other postgres error
 */
router.get('', (req, res) => {
    // check auth and other stuff here
    
    pool.query(queries.getOpenMind, [ req.query.last_id ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows);
    });
});

/*
 * POST /api/openmind
 * Add entry to OMA.
 *
 * Request Body:
 *  <object>
 *    user_id   <int> required
 *    body      <string> required
 *
 * Response:
 *  201: success
 *    <object>
 *      omid    <int>
 *  500: other postgres error
 */
router.post('', (req, res) => {
    // check auth and other stuff here

    const values = [
        req.body.user_id,
        req.body.body
    ];

    pool.query(queries.postOpenMind, values, (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(201).json(q_res.rows[0]);
    });
});

/*
 * DELETE /api/openmind/{omid}
 * Delete entry from OMA.
 *
 * Request Parameters:
 *  path:
 *    omid <int> required
 * 
 * Response:
 *  204: success
 *  404: OMA entry does not exist
 *  500: other postgres error
 */
router.delete('/:omid', (req, res) => {
    // check auth and other stuff here

    pool.query(queries.deleteOpenMind, [ req.params.omid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else if (!q_res.rows.length)
            res.status(404).json({ err: 'OMA entry does not exist: ' + req.params.omid });
        else
            res.status(204).send();
    });
});

module.exports = router;
