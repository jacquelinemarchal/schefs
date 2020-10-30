/*
 * $1: date_from <string | Date> - if string, must be of form 'YYY-MM-DD'
 * $2: date_to   <string | Date> - if string, must be of form 'YYY-MM-DD'
 * $3: status    <string> default 'approved' - one of 'approved', 'denied', 'pending', 'all'
 */
const getEventsSummary = `
    SELECT
        e.eid, e.host_name, e.host_school,
        e.title, e.img_thumbnail, e.time_start
    FROM events AS e
    WHERE (
        COALESCE($1) = '' OR
        e.time_start >= TO_DATE($1, 'YYYY-MM-DD')
    ) AND (
        COALESCE($2) = '' OR
        e.time_start <= TO_DATE($2, 'YYYY-MM-DD')
    ) AND (
        'all' = $3 OR
        e.status = $3
    )
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
        'title', e.title,
        'description', e.description,
        'requirements', e.requirements,
        'img_thumbnail', e.img_thumbnail,
        'time_start', e.time_start,
        'hosts', (
            SELECT JSON_AGG(ROW_TO_JSON(u))
            FROM users AS u
            LEFT JOIN event_hosts AS eh
                ON u.uid = eh.user_id
            WHERE eh.event_id = e.eid
        )
    )
    FROM events AS e
    WHERE (
        COALESCE($1) = '' OR
        e.time_start >= TO_DATE($1, 'YYYY-MM-DD')
    ) AND (
        COALESCE($2) = '' OR
        e.time_start <= TO_DATE($2, 'YYYY-MM-DD')
    ) AND (
        'all' = $3 OR
        e.status = $3
    )
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
        'title', e.title,
        'description', e.description,
        'requirements', e.requirements,
        'img_thumbnail', e.img_thumbnail,
        'time_start', e.time_start,
        'hosts', (
            SELECT JSON_AGG(ROW_TO_JSON(u))
            FROM users AS u
            LEFT JOIN event_hosts AS eh
                ON u.uid = eh.user_id
            WHERE eh.event_id = e.eid
        )
    )
    FROM events AS e
    WHERE e.eid = $1
`;

/*
 * $1: eid <int>
 */
const countReservedTickets = `
    SELECT COUNT(*) FROM tickets
    WHERE event_id = $1
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

module.exports = {
    getEventsSummary,
    getEventsDetailed,
    getEvent,
    countReservedTickets,
    reserveTicket,
    deleteTicket,
};
