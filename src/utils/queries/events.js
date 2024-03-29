/*
 * $1: date_from <string | Date> - if string, must be of form 'YYY-MM-DD'
 * $2: date_to   <string | Date> - if string, must be of form 'YYY-MM-DD'
 * $3: status    <string> default 'approved' - one of 'approved', 'denied', 'pending', 'all'
 */
const getEventsSummary = `
    SELECT
        e.eid, e.host_name, e.host_school,
        e.host_bio, e.title, e.time_start,
        t.location AS img_thumbnail,
        e.status
    FROM events AS e, thumbnails AS t
    WHERE (
        COALESCE($1) = '' OR
        e.time_start >= TO_DATE($1, 'YYYY-MM-DD')
    ) AND (
        COALESCE($2) = '' OR
        e.time_start <= TO_DATE($2, 'YYYY-MM-DD')
    ) AND (
        'all' = $3 OR
        e.status = $3
    ) AND t.tid = e.thumbnail_id
    ORDER BY e.time_start ASC
`;

/*
 * $1: date_from <string | Date> - if string, must be of form 'YYY-MM-DD'
 * $2: date_to   <string | Date> - if string, must be of form 'YYY-MM-DD'
 * $3: status    <string> default 'approved' - one of 'approved', 'denied', 'pending', 'all'
 */
const getEventsDetailed = `
    SELECT JSON_BUILD_OBJECT(
        'eid', e.eid,
        'host_name', e.host_name,
        'host_school', e.host_school,
        'host_bio', e.host_bio,
        'title', e.title,
        'description', e.description,
        'requirements', e.requirements,
        'img_thumbnail', t.location,
        'time_start', e.time_start,
        'status', e.status,
        'hosts', (
            SELECT JSON_AGG(ROW_TO_JSON(r))
            FROM (
                SELECT 
                    u.uid,
                    u.first_name,
                    u.last_name,
                    u.img_profile,
                    u.bio,
                    u.school,
                    u.major,
                    u.grad_year,
                    u.is_email_public,
                    u.email
                FROM users AS u
                LEFT JOIN event_hosts AS eh
                    ON u.uid = eh.user_id
                WHERE eh.event_id = e.eid
            ) AS r
        ),
        'attendees', (
            SELECT JSON_AGG(ROW_TO_JSON(r))
            FROM (
                SELECT
                    u.uid,
                    u.first_name,
                    u.last_name,
                    u.img_profile,
                    u.bio,
                    u.school,
                    u.major,
                    u.grad_year,
                    u.is_email_public,
                    u.email
                FROM users AS u
                LEFT JOIN tickets AS tk
                    ON u.uid = tk.user_id
                WHERE tk.event_id = e.eid
            ) AS r
        )
    )
    FROM events AS e, thumbnails AS t
    WHERE (
        COALESCE($1) = '' OR
        e.time_start >= TO_DATE($1, 'YYYY-MM-DD')
    ) AND (
        COALESCE($2) = '' OR
        e.time_start <= TO_DATE($2, 'YYYY-MM-DD')
    ) AND (
        'all' = $3 OR
        e.status = $3
    ) AND
        t.tid = e.thumbnail_id
    ORDER BY e.time_start ASC
`;

/*
 * $1: eid <int>
 */
const getEvent = `
    SELECT JSON_BUILD_OBJECT(
        'eid', e.eid,
        'host_name', e.host_name,
        'host_school', e.host_school,
        'host_bio', e.host_bio,
        'title', e.title,
        'description', e.description,
        'requirements', e.requirements,
        'img_thumbnail', t.location,
        'zoom_link', e.zoom_link,
        'zoom_id', e.zoom_id,
        'gcal_id', e.gcal_id,
        'time_start', e.time_start,
        'status', e.status,
        'hosts', (
            SELECT JSON_AGG(ROW_TO_JSON(r))
            FROM (
                SELECT
                    u.uid,
                    u.first_name,
                    u.last_name,
                    u.img_profile,
                    u.bio,
                    u.school,
                    u.major,
                    u.grad_year,
                    u.email
                FROM users AS u
                LEFT JOIN event_hosts AS eh
                    ON u.uid = eh.user_id
                WHERE eh.event_id = e.eid
            ) AS r
        )
    ) AS event
    FROM events AS e, thumbnails AS t
    WHERE e.eid = $1 AND t.tid = e.thumbnail_id
`;

/* 
 * $1: eid <int> required
 */
const getGcalId = `
    SELECT gcal_id FROM events
    WHERE eid = $1
`;

/*
 * $1:  host_name     <string> required
 * $2:  host_school   <string> required
 * $3:  host_bio      <string> required
 * $4:  title         <string> required
 * $5:  description   <string> required
 * $6:  requirements  <string>
 * $7:  thumbnail_id  <int>    required
 * $8:  zoom_link     <string>
 * $9:  zoom_id       <long>
 * $10: gcal_id       <string>
 * $11: time_start    <Date>   required
 * $12: status        <string>
 */
const createEvent = `
    WITH thumb AS (
        UPDATE thumbnails AS t
        SET is_used = true
        WHERE t.tid = $7
    )
    INSERT INTO events (
        host_name,
        host_school,
        host_bio,
        title,
        description,
        requirements,
        thumbnail_id,
        zoom_link,
        zoom_id,
        gcal_id,
        time_start,
        status
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12
    )
    RETURNING eid
`;

/*
 * Intended to be used in same transaction
 * as createEvent.
 *
 * $1: user_id  <int> required
 * $2: event_id <int> required
 */
const createHost = `
    INSERT INTO event_hosts (
        user_id,
        event_id
    ) VALUES (
        $1,
        $2
    )
`;

/*
 * $1:  host_name    <string>
 * $2:  host_school  <string>
 * $3:  host_bio     <string>
 * $4:  title        <string>
 * $5:  description  <string>
 * $6:  requirements <string>
 * $7:  thumbnail_id <int>
 * $8:  time_start   <Date>
 * $9:  status       <string>
 * $10: eid          <int>
 */
const updateEvent = `
    UPDATE events
    SET host_name = COALESCE($1, host_name),
        host_school = COALESCE($2, host_school),
        host_bio = COALESCE($3, host_bio),
        title = COALESCE($4, title),
        description = COALESCE($5, description),
        requirements = COALESCE($6, requirements),
        thumbnail_id = COALESCE($7, thumbnail_id),
        time_start = COALESCE($8, time_start),
        time_created = CURRENT_TIMESTAMP,
        status = COALESCE($9, status)
    WHERE eid = $10
`;

/*
 * $1: time_start <Date>
 * $2: time_end   <Date>
 */
const checkTimeAvailable = `
    SELECT (COUNT(eid) = 0) AS available
    FROM events
    WHERE time_start >= $1
    AND time_start <= $2
    AND status != 'denied'
`

/*
 * $1: eid <int>
 */
const getReservedTicketsCount = `
    SELECT COUNT(*) FROM tickets
    WHERE event_id = $1
`;

/*
* $1: date_from <string | Date> - if string, must be of form 'YYYY-MM-DD'
* $2: date_to   <string | Date> - if string, must be of form 'YYYY-MM-DD'
*/
const getAllReservedTicketsCount = `
    SELECT COUNT(*) FROM tickets AS t
    WHERE (
        COALESCE($1) = '' OR
        t.time_created >= TO_DATE($1, 'YYYY-MM-DD')
    ) AND (
        COALESCE($2) = '' OR
        t.time_created <= TO_DATE($2, 'YYYY-MM-DD')
    )
`;

/*
* $1: date_from <string | Date> - if string, must be of form 'YYYY-MM-DD'
* $2: date_to   <string | Date> - if string, must be of form 'YYYY-MM-DD'
* $3: status    <string> default 'approved' - one of 'approved', 'denied', 'pending', 'all'
*/
const getAllEventsCount = `
    SELECT COUNT(*) FROM events AS e
    WHERE (
        COALESCE($1) = '' OR
        e.time_created >= TO_DATE($1, 'YYYY-MM-DD')
    ) AND (
        COALESCE($2) = '' OR
        e.time_created <= TO_DATE($2, 'YYYY-MM-DD')
    ) AND (
        'all' = $3 OR
        e.status = $3
    )
`;

/*
 * $1: event_id <int> required
 * $2: user_id  <int> required
 */
const checkTicketStatus = `
    SELECT * FROM tickets
    WHERE event_id = $1 AND user_id = $2
`;

/*
 * $1: eid <int> required
 */
const getReservedTickets = `
    SELECT uid, first_name, last_name FROM users
    LEFT JOIN tickets ON users.uid = tickets.user_id
    WHERE tickets.event_id = $1
`;

/*
 * $1: event_id <int>
 * $2: user_id  <int>
 */
const reserveTicket = `
    INSERT INTO tickets(event_id, user_id)
    VALUES($1, $2)
`;

/*
 * $1: event_id <int>
 * $2: user_id  <int>
 */
const deleteTicket = `
    DELETE FROM tickets
    WHERE event_id = $1 AND user_id = $2
    RETURNING user_id
`;

/* 
 * $1: user_id <int>
 * $2: name  <string>
 * $3: body  <string>
 * $4: school  <string>
 * $5: event_id <int>
 */
const postComment = `
    INSERT INTO COMMENTS(user_id, name, body, school, event_id)
    VALUES ($1, $2, $3, $4, $5)
`;

/* 
 * $1: event_id <int>
 */
const getComments = `
    SELECT * FROM comments
    WHERE event_id = $1
    ORDER BY time_created ASC
`;

module.exports = {
    postComment,
    getComments,
    getEventsSummary,
    getEventsDetailed,
    getEvent,
    getGcalId,
    getReservedTickets,
    getReservedTicketsCount,
    checkTimeAvailable,
    getAllReservedTicketsCount,
    getAllEventsCount,
    checkTicketStatus,
    reserveTicket,
    deleteTicket,
    createEvent,
    updateEvent,
    createHost,
};
