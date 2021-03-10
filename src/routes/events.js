const moment = require('moment-timezone');
const schedule = require('node-schedule');

const { verifyFirebaseIdToken } = require('../middleware/auth');

const express = require('express');
const pool = require('../utils/db');
const queries = require('../utils/queries/events');
const thumbnail_queries = require('../utils/queries/thumbnails');
const emails = require('../utils/emails');

const router = express.Router();

// TODO: event approval/denial

/*
 * GET /api/events
 * List events (summary) within date range, in ascending order by date/time.
 * 
 *                  SAMPLE
 * let query = {
 *      params: {
 *          date_from:"2020-08-09",
 *          date_to:"2020-08-09",
 *      }
 * }
 * axios.get("backend.com/api/events", query)
 *
 *
 *                  SAMPLE
 * let query = {
 *      params: {
 *          date_from:"2020-08-09",
 *          date_to:"2020-08-09",
 *      }
 * }
 * axios.get("backend.com/api/events", query)
 *
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
 *      host_bio      <string>
 *      title         <string>
 *      description   <string>        - if type = 'detailed'
 *      requirements  <string>        - if type = 'detailed'
 *      img_thumbnail <string>
 *      zoom_link     <string>        - if type = 'detailed'
 *      zoom_id       <string>        - if type = 'detailed'
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
 *        grad_year   <string>
 *  400: invalid value for 'status' or 'type'
 *  500: other postgres error
 */
router.get('', (req, res) => {
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
 *      host_bio      <string>
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
 *        grad_year   <string>
 *  404: event does not exist
 *  500: other postgres error
 */
router.get('/:eid', (req, res) => {
    pool.query(queries.getEvent, [ req.params.eid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else if (!q_res.rows.length)
            res.status(404).json({ err: 'Event does not exist: ' + req.params.eid });
        else
            res.status(200).json(q_res.rows[0].json_build_object);
    });
});

/* POST /api/events
 * Create a new event.
 *
 * Authorization:
 *  Firebase ID Token
 *
 * Request Body:
 *  <object>
 *    title         <string>        required
 *    description   <string>        required
 *    requirements  <string>
 *    thumbnail_id  <int>           required
 *    host_bio      <string>        required
 *    time_start    <Date>          required
 *    hosts         <array[object]> required
 *      uid         <int>           required
 *      first_name  <string>        required
 *      last_name   <string>        required
 *      school      <string>        required
 *
 * Response:
 *  201: successfully created
 *  403: attempting to create event for non-self user
 *  406: required field missing
 *  409: thumbnail already in use
 *  500: other postgres error
 */
router.post('', verifyFirebaseIdToken, async (req, res) => {
    if (!req.body.hosts.map(host => host.uid).includes(req.profile.uid)) {
        res.status(403).json({ err: 'Cannot make an event for someone else!' });
        return;
    }

    let host_name, host_school;
    if (req.body.hosts > 1) {
        host_name = req.body.hosts.map(host => host.first_name).join(', ');
        host_school = req.body.hosts.map(host => host.school).join(', ');
    } else {
        host_name = req.body.hosts[0].first_name + ' ' + req.body.hosts[0].last_name;
        host_school = req.body.hosts[0].school;
    }

    const values = [
        host_name,
        host_school,
        req.body.host_bio,
        req.body.title,
        req.body.description,
        req.body.requirements,
        req.body.thumbnail_id,
        '', // zoom link empty for now
        '', // zoom id empty for now
        req.body.time_start,
        'pending', // default status pending        
    ];

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const valid_thumb = (await client.query(thumbnail_queries.checkThumbnail, [ req.body.thumbnail_id ])).rows.length > 0;
        if (!valid_thumb) {
            await client.query('COMMIT');
            res.status(409).json({ err: 'Thumbnail already in use' });
        } else {
            await client.query(thumbnail_queries.setThumbnailUsed, [ req.body.thumbnail_id ]);

            const eid = (await client.query(queries.createEvent, values)).rows[0].eid;	
            for (const host of req.body.hosts)
                await client.query(queries.createHost, [ host.uid, eid ]);

            await client.query('COMMIT');

            // send email
            emails.sendEventSubmittedEmail(
                req.profile.email,
                req.profile.first_name,
                req.body.title
            );

            res.status(201).send();

        }
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23502') // not_null_violation
            res.status(406).json({ err: 'Required field missing' });
        else
            res.status(500).json({ err: 'PSQL Error: ' + err.message });
    } finally {
        client.release();
    }
});

/*
 * PUT /api/events/{eid}
 * Update an event.
 *
 * Authorization:
 *  Firebase ID Token
 *
 * Request Parameters
 *  path:
 *    eid <int> required
 *
 * Request Body:
 *  <object>
 *    host_name              <string>
 *    host_school            <string>
 *    host_bio               <string>
 *    title                  <string>
 *    description            <string>
 *    requirements           <string>
 *    thumbnail_id           <int> - id of the new thumbnail, if changing
 *    zoom_link              <string>
 *    zoom_id                <string>
 *    time_start             <Date>
 *    status                 <string>
 *
 * Response:
 *  201: successfully updated
 *  403: must be an admin to update an event
 *  406: eid missing
 *  409: thumbnail already in use
 *  500: other postgres error
 */
router.put('/:eid', verifyFirebaseIdToken, (req, res) => {
    if (!req.params.eid) {
        res.status(406).json({ err: 'eid is required' });
    	return;
    }

    if (!req.profile.is_admin) {
        res.status(403).json({ err: 'Must be an admin to update an event' });
        return;
    }

    const values = [
        req.body.host_name|| null,
        req.body.host_school || null,
        req.body.host_bio || null,
        req.body.title || null,
        req.body.description || null,
        req.body.requirements || null,
        req.body.thumbnail_id || null,
        req.body.zoom_link || null,
        req.body.zoom_id || null,
        req.body.time_start || null,
        req.body.status || null,
        req.params.eid
    ];

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        if (req.body.thumbnail_id &&
            (await client.query(thumbnail_queries.checkThumbnail, [ req.body.thumbnail_id ])).rows.length > 0
        ) {
            await client.query('COMMIT');
            res.status(409).json({ err: 'Thumbnail already in use' });
        } else {
            const orig_event = (await client.query(queries.getEvent, [ req.params.eid ])).rows[0];

            if (req.body.thumbnail_id)
                await client.query(thumbnail_queries.replaceThumbnail, [
                    orig_event.img_thumbnail,
                    req_body.thumbnail_id,
                ]);

            await client.query(queries.updateEvent, values);
            await client.query('COMMIT');

            // send email on approval
            if (orig_event.status !== 'approved' && req.body.status === 'approved') {
                const event_time = req.body.time_start || orig_event.time_start;
                for (const host of orig_event.hosts) {
                    emails.sendEventApprovedEmail(
                        host.email,
                        host.first_name,
                        req.body.title || orig_event.title,
                        moment.tz(event_time, 'America/New_York').format('dddd, MMMM D, YYYY'),
                        moment.tz(event_time, 'America/New_York').format('h:mm A, z'),
                        process.env.BASE_URL + '/' + orig_event.eid,
                        req.body.zoom_link || orig_event.zoom_link
                    );
                }

            // or send email on denial
            } else if (orig_event.status !== 'denied' && req.body.status === 'denied') {
                for (const host of orig_event.hosts) {
                    emails.sendEventDeniedEmail(
                        host.email,
                        host.first_name,
                        req.body.title || orig_event.title,
                        req.body.description || orig_event.description,
                        req.body.requirements || orig_event.requirements,
                        req.body.host_bio || orig_event.host_bio
                    );
                }
            }

            res.status(201).send();
        }
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23502') // not_null_violation
            res.status(406).json({ err: 'Required field missing' });
        else
            res.status(500).json({ err: 'PSQL Error: ' + err.message });
    } finally {
        client.release();
    }
});

/*
 * POST /api/events/{eid}/tickets
 * Reserve ticket associated with a specified event and user.
 *
 * TODO: Restrict to self/admin
 *
 * Authorization:
 *  Firebase ID Token
 *
 * Request Parameters:
 *  path:
 *    eid <int> required
 *
 * Response:
 *  201: success
 *  404: event and/or user do not exist
 *  406: event sold out or ticket already reserved
 *  500: other postgres error
 */
router.post('/:eid/tickets', verifyFirebaseIdToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const count = await client.query(queries.getReservedTicketsCount, [ req.params.eid ]);
        if (count > 14) {
            await client.query('COMMIT');
            res.status(406).json({ err: 'Event sold out: ' + req.params.eid });
        } else {
            const values = [
                req.params.eid,
                req.profile.uid,
            ];

            await client.query(queries.reserveTicket, values);
            await client.query('COMMIT');

            // handle emails
            
            // reserve email
            const event = (await pool.query(queries.getEvent, [ req.params.eid ])).rows[0].event;
            emails.sendReserveEmail(
                req.profile.email,
                req.profile.first_name,
                event.title,
                moment.tz(event.time_start, 'America/New_York').format('dddd, MMMM D, YYYY'),
                moment.tz(event.time_start, 'America/New_York').format('h:mm A, z'),
                process.env.BASE_URL + '/events/' + req.params.eid
            );

            // schedule 24 hour email 
            time_24hr = new Date(event.time_start);
            time_24hr.setDate(time_24hr.getDate() - 1);
            schedule.scheduleJob(time_24hr, () => emails.send24HourReminderEmail(
                req.profile.email,
                req.profile.first_name,
                event.title
            ));

            // schedule 30 minute email
            time_30min = new Date(event.time_start);
            time_30min.setMinutes(time_30min.getMinutes() - 30);
            schedule.scheduleJob(time_30min, () => emails.send30MinuteReminderEmail(
                req.profile.email,
                req.profile.first_name,
                event.title,
                event.zoom_link
            ));

            // schedule post-event email
            time_post = new Date(event.time_start);
            time_post.setHours(time_post.getHours() + 2);
            schedule.scheduleJob(time_post, () => emails.sendPostEventEmail(
                req.profile.email,
                req.profile.first_name,
                event.title
            ));

            res.status(201).send();
        }
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23503') // foreign_key_violation
            res.status(404).json({ err: 'Event and/or user does not exist' });
        else if (err.code === '23505') // unique_violation
            res.status(406).json({ err: 'Ticket already reserved' });
        else
            res.status(500).json({ err: 'PSQL Error: ' + err.message });
    } finally {
        client.release();
    }
});

/*
 * DELETE /api/events/{eid}/tickets/{uid}
 * Delete ticket associated with a specified event and user.
 *
 * TODO: Restrict to self/admin
 *
 * Authorization:
 *  Firebase ID Token
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
router.delete('/:eid/tickets/:uid', verifyFirebaseIdToken, (req, res) => {
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
 *      count <int>
 *  404: event does not exist
 *  500: other postgres error
 */
router.get('/:eid/countTickets', (req, res) => {
    pool.query(queries.getReservedTicketsCount, [ req.params.eid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows[0]);
    });
});

/*
 * GET /api/events/{eid}/{user}/ticketstatus
 * Get boolean whether or not user has reserved ticket.
 *
 * Request Parameters:
 *  path:
 *    eid <int> required
 *    user_id <int>
 *
 * Response:
 *  200: successfully retrieved
 *    <boolean> 
 *  500: other postgres error
 */
router.get('/:eid/:uid/ticketstatus', (req, res) => {
    pool.query(queries.checkTicketStatus, [ req.params.eid, req.params.uid ], (q_err, q_res) => {
        if (q_err){
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        }
        else{
            if (q_res.rows.length){
                res.status(200).json(true);
            }
            else{
                res.status(200).json(false);

            }
        }
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
 *      uid        <int>
 *      first_name <string>
 *      last_name  <string>
 *  404: event does not exist
 *  500: other postgres error
 */
router.get('/:eid/tickets', (req, res) => {
    // check auth and other stuff here
    pool.query(queries.getReservedTickets, [ req.params.eid ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows);
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
 *      cid           <int>
 *      event_id      <int>
 *      user_id       <int>
 *      name          <string>
 *      school        <string>
 *      body          <string>
 *      time_created  <Date>
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
 *      school      <string> required
 *
 * Response:
 *  201: successfully added comment
 *  500: other postgres error
 */

router.post('/:eid/comment', (req, res) => {
    // check auth and other stuff here
    const values = [req.body.user_id, req.body.name, req.body.body, req.body.school, req.params.eid]
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
