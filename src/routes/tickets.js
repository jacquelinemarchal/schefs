const express = require('express');
const pool = require('../../db');

const router = express.Router();

/*
 * Request:
 *  <object>
 *    user_id  <int> required
 *    event_id <int> required
 *
 * Response:
 *   204: successfully reserved
 *   406: event sold out
 *   500: postgres error
 */
router.post('/reserve', async (req, res) => {
    // check auth and other stuff here
    
    const q = `
        INSERT INTO tickets(user_id, event_id)
        SELECT $1, $2
        WHERE (SELECT COUNT(*) FROM tickets WHERE event_id = $2) <= 15
        RETURNING event_id
    `;

    pool.query(q, [ req.body.user_id, req.body.event_id ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else if (q_res.rows === 0)
            res.status(406).json({ err: 'Event sold out: ' + req.body.event_id });
        else
            res.status(204).send();
    });
});

/*
 * Request:
 *  <object>
 *    user_id  <int> required
 *    event_id <int> required
 *
 * Response:
 *  204: successfully unreserved
 *  500: postgres error
 */
router.delete('/unreserve', (req, res) => {
    // check auth and other stuff here
    
    const q = `
        DELETE FROM tickets
        WHERE user_id = $1 AND event_id = $2
    `;

    pool.query(q, [ req.body.user_id, req.body.event_id ], (err, q_res) => {
        if (err)
            res.status(500).json({ err: 'PSQL Error: ' + err.name });
        else
            res.status(204).send();
    });
});

module.exports = router;
