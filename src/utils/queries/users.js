/*
 * $1: uid <int> required
 */
const getUser = `
    SELECT * FROM users
    WHERE uid = $1
`;

/*
* $1: date_from <string | Date> - if string, must be of form 'YYYY-MM-DD'
* $2: date_to   <string | Date> - if string, must be of form 'YYYY-MM-DD'
*/
const getUserCount = `
    SELECT COUNT(*) FROM users AS u
    WHERE (
        COALESCE($1) = '' OR
        u.time_created >= TO_DATE($1, 'YYYY-MM-DD')
    ) AND (
        COALESCE($2) = '' OR
        u.time_created <= TO_DATE($2, 'YYYY-MM-DD')
    )
`;

/*
 * $1: fb_uid <string> required
 */
const getUserFirebase = `
    SELECT * FROM users
    WHERE fb_uid = $1
`;

/*
 * $1:  fb_uid      <string> required
 * $2:  email       <string> required
 * $3:  phone       <string>
 * $4:  first_name  <string> required
 * $5:  last_name   <string> required
 * $6:  img_profile <string>
 * $7:  bio         <string>
 * $8:  school      <string> required
 * $9:  major       <string> required
 * $10: grad_year   <int>    required
 */
const postSignup = `
    INSERT INTO users (
        fb_uid,
        email,
        phone,
        first_name,
        last_name,
        img_profile,
        bio,
        school,
        major,
        grad_year
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
        $10
    )
`;

/*
 * $1:  email		<string>
 * $2:  phone		<string>
 * $3:  first_name	<string>
 * $4:  last_name	<string>
 * $5:  img_profile	<string>
 * $6:  bio			<string>
 * $7:  school		<string>
 * $8:  major		<string>
 * $9:  grad_year	<string>
 * $10: uid			<int> required
 */
const updateUser = `
	UPDATE users
	SET email = COALESCE($1, email),
	    phone = COALESCE($2, phone),
	    first_name = COALESCE($3, first_name),
	    last_name = COALESCE($4, last_name),
	    img_profile = COALESCE($5, img_profile),
	    bio = COALESCE($6, bio),
	    school = COALESCE($7, school),
	    major = COALESCE($8, major),
	    grad_year = COALESCE($9, grad_year)
	WHERE uid = $10
`;	

/*
 * $1: uid <int> required
 */
const getUserLiveEvents = `
    SELECT DISTINCT
        e.eid, e.host_name, e.host_school,
        e.host_bio, e.title, e.time_start,
        eh.user_id AS host_id,
        th.location AS img_thumbnail
    FROM
        events AS e,
        event_hosts AS eh,
        tickets AS t,
        thumbnails AS th
    WHERE
        e.thumbnail_id = th.tid
    AND e.eid = eh.event_id
    AND (
        (t.event_id = e.eid AND t.user_id = $1 AND eh.user_id != $1)
     OR (e.status = 'approved' AND eh.user_id = $1)
    )
    ORDER BY e.time_start DESC
`;

/*
 * $1: uid <int> required
 */
const getUserHostingEvents = `
    SELECT 
        e.eid, e.host_name, e.host_school,
        e.host_bio, e.title, e.time_start,
        th.location AS img_thumbnail,
        e.status
    FROM
        events AS e,
        event_hosts AS eh,
        thumbnails AS th
    WHERE
        e.thumbnail_id = th.tid
    AND e.eid = eh.event_id
    AND eh.user_id = $1
    ORDER BY e.time_start DESC
`;

/*
 * $1: uid <int> required
 */
const getUserPastEvents = `
    SELECT DISTINCT ON (e.time_start, e.eid)
    JSON_BUILD_OBJECT(
        'eid', e.eid,
        'host_name', e.host_name,
        'host_school', e.host_school,
        'host_bio', e.host_bio,
        'title', e.title,
        'img_thumbnail', t.location,
        'time_start', e.time_start,
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
                    u.grad_year
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
                    u.grad_year
                FROM users AS u
                LEFT JOIN tickets AS tk
                ON u.uid = tk.user_id
                WHERE tk.event_id = e.eid
            ) AS r
        )
    )
    FROM
        events AS e,
        thumbnails AS t,
        event_hosts AS eh,
        tickets AS tk
    WHERE
        e.status = 'approved'
    AND t.tid = e.thumbnail_id
    AND e.time_start < CURRENT_TIMESTAMP
    AND (
        (tk.event_id = e.eid AND tk.user_id = $1)
     OR (eh.event_id = e.eid AND eh.user_id = $1)
    )
    ORDER BY
        e.time_start DESC,
        e.eid
`;


module.exports = {
    getUser,
    getUserCount,
    getUserFirebase,
    postSignup,
	updateUser,
    getUserLiveEvents,
    getUserHostingEvents,
    getUserPastEvents,
};
