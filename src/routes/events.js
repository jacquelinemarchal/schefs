const express = require('express');
const pool = require('../utils/db');
const queries = require('../utils/events_queries');

const router = express.Router();

/*
 * GET /api/events
 * List events (summary) within date range, in ascending order by date/time.
 * 
 *             SAMPLE
 * let query = {
 *      params{
 *          date_from:"2020-08-09",
 *          date_to:"2020-08-09",
 *      }
 * }
 * axios.get("backend.com/api/events", query)
 *
 *                  SAMPLE
 * let query = {
 *      params{
 *          date_from:"2020-08-09",
 *          date_to:"2020-08-09",
 *      }
 * }
 * axios.get("backend.com/api/events", query)
 *
 * 
 * Request Parameters:
 *  query:
 *    date_from <string | Date> - if string, must be of form 'YYYY-MM-DD'
 *    date_to   <string | Date> - if string, must be of form 'YYYY-MM-DD'
 *    status    <string> default 'approved' - one of 'approved', 'denied', 'pending', 'all'
 *    type      <string> default 'summary' - one of 'summary', 'detailed'
 *
 * Response:
 *  200: success
 *    <array[object]>
 *      eid           <int>
 *      host_name     <string>
 *      host_school   <string>
 *      title         <string>
 *      description   <string>        - if type = 'detailed'
 *      requirements  <string>        - if type = 'detailed'
 *      img_thumbnail <string>
 *      time_start    <Date>
 *      hosts         <array[object]> - if type = 'detailed'
 *        uid         <int>
 *        email       <string>
 *        phone       <string>
 *        first_name  <string>
 *        last_name   <string>
 *        img_profile <string>
 *        bio         <string>
 *        school      <string>
 *        major       <string>
 *        grad_year   <int>
 *  400: invalid value for 'status' or 'type'
 *  500: other postgres error
 */
router.get('', (req, res) => {
    // check auth and other stuff here

    let q = '';
    if (req.query.type === 'detailed')
        q = queries.getEventsDetailed;
    else if (!req.query.type || req.query.type === 'summary')
        q = queries.getEventsSummary;
    else {
        res.status(400).json({ err: 'Invalid type parameter' });
        return;
    }

    if (req.query.status && (
        req.query.status !== 'approved' &&
        req.query.status !== 'denied'   &&
        req.query.status !== 'pending'  &&
        req.query.status !== 'all')) {

        res.status(400).json({ err: 'Invalid status parameter' });
        return;
    }

    const values = [
        req.query.date_from ? req.query.date_from : '',
        req.query.date_to ? req.query.date_to : '',
        req.query.status ? req.query.status : 'approved'
    ];

    pool.query(q, values, (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else {
            if (req.query.type === 'detailed')
                res.status(200).json(q_res.rows.map(o => o.json_build_object));
            else
                res.status(200).json(q_res.rows);
        }
    });
});

/*
 * GET /api/events/{eid}
 * Get event object (detailed) with specified database eid.
 *
 * Request Parameters:
 *  path:
 *    eid <int> required
 *
 * Response:
 *  200: successfully retrieved
 *    <object>
 *      eid           <int>
 *      host_name     <string>
 *      host_school   <string>
 *      title         <string>
 *      description   <string>
 *      requirements  <string>
 *      img_thumbnail <string>
 *      time_start    <Date>
 *      hosts         <array[object]>
 *        uid         <int>
 *        email       <string>
 *        phone       <string>
 *        first_name  <string>
 *        last_name   <string>
 *        img_profile <string>
 *        bio         <string>
 *        school      <string>
 *        major       <string>
 *        grad_year   <int>
 *  404: event does not exist
 *  500: other postgres error
 */
router.get('/:eid', (req, res) => {
    // check auth and other stuff here
    pool.query(queries.getEvent, [ req.params.eid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else if (!q_res.rows.length)
            res.status(404).json({ err: 'Event does not exist: ' + req.params.eid });
        else
            res.status(200).json(q_res.rows[0].json_build_object);
    });
});

/*
 * POST /api/events/{eid}/tickets
 * Reserve ticket associated with a specified event and user.
 *
 * Request Parameters:
 *  path:
 *    eid <int> required
 *
 * Request Body:
 *  <object>
 *    user_id <int> required
 *
 * Response:
 *  201: success
 *  404: event and/or user do not exist
 *  406: event sold out or ticket already reserved
 *  500: other postgres error
 */
router.post('/:eid/tickets', async (req, res) => {
    // check auth and other stuff here

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const count = await client.query(queries.countReservedTickets, [ req.params.eid ]);
        if (count > 14)
            res.status(406).json({ err: 'Event sold out: ' + req.params.eid });
        else {
            await client.query(queries.reserveTicket, [ req.params.eid, req.body.user_id ]);
            await client.query('COMMIT');
            res.status(201).send();
        }
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23503') // foreign_key_violation
            res.status(404).json({ err: 'Event and/or user does not exist' });
        else if (err.code === '23505') // unique_violation
            res.status(406).json({ err: 'Ticket already reserved' });
        else
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
    } finally {
        client.release();
    }
});

/*
 * DELETE /api/events/{eid}/tickets/{uid}
 * Delete ticket associated with a specified event and user.
 *
 * Request Parameters:
 *  path:
 *    eid <int> required
 *    uid <int> required
 *
 * Response:
 *  204: success
 *  404: event and/or user and/or ticket do not exist
 *  500: other postgres error
 */
router.delete('/:eid/tickets/:uid', (req, res) => {
    // check auth and other stuff here

    const values = [ req.params.eid, req.params.uid ];
    pool.query(queries.deleteTicket, values, (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + err.name });
        else if (!q_res.rows.length)
            res.status(404).json({
                err: 'Event, user, and/or ticket does not exist'
            });
        else
            res.status(204).send();
    });
});


/*
 * GET /api/events/{eid}/countTickets
 * Get number of tickets with specified database eid.
 *
 * Request Parameters:
 *  path:
 *    eid <int> required
 * 
 * Response:
 *  200: successfully retrieved
 *    <object>
 *      count          <int>
 *  404: event does not exist
 *  500: other postgres error
 */
router.get('/:eid/countTickets', (req, res) => {
    // check auth and other stuff here
    pool.query(queries.getReservedTicketsCount, [ req.params.eid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows[0]);
    });
});

/*
 * GET /api/events/{eid}/tickets
 * Get array of ticket objects for event of specified eid containing 
 * user's first name, last name, and uid.
 *
 * Request Parameters:
 *  path:
 *    eid <int> required
 * 
 * Response:
 *  200: successfully retrieved
 *    <object>
 *      eid           <int>
 *  404: event does not exist
 *  500: other postgres error
 */
router.get('/:eid/tickets', (req, res) => {
    // check auth and other stuff here
    pool.query(queries.getReservedTickets, [ req.params.eid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows[0]);
    });
});


/*
 * GET /api/events/{eid}/comments
 * Get array of comment objects for event of specified eid containing 
 * cid, uid, name, body, time_created
 *
 * Request Parameters:
 *  path:
 *    eid <int> required
 * 
 * Response:
 *  200: successfully retrieved
 *    <object>
 *      eid           <int>
 *  404: event does not exist
 *  500: other postgres error
 */
router.get('/:eid/comments', (req, res) => {
    // check auth and other stuff here
    pool.query(queries.getComments, [ req.params.eid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows);
    });
});


/*
 * POST /api/events/{eid}/comment
 * Submit comment to specific event
 *
 * Request Parameters:
 *  path:
 *    eid <int> required
 *
 * Request Body:
 *  <object>
 *      user_id     <int> required
 *      name        <string> required
 *      body        <string> required
 *
 * Response:
 *  201: successfully added comment
 *  500: other postgres error
 */

router.post('/:eid/comment', (req, res) => {
    // check auth and other stuff here
    const values = [req.body.user_id, req.body.name, req.body.body, req.params.eid]
    pool.query(queries.postComment, values, (q_err, q_res) => {
        if (q_err){
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        }
        else{
            res.status(201).send()
        }
    })

});

module.exports = router;
