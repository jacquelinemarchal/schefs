/*
 * $1: uid <int> required
 */
const getUser = `
    SELECT * FROM users
    WHERE uid = $1
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
    SELECT 
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
        (t.event_id = e.eid AND t.user_id = $1 AND eh.user_id != $1) OR
        (e.status = 'approved' AND eh.user_id = $1)
    )
    ORDER BY e.time_start ASC
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
    ORDER BY e.time_start ASC
`;

module.exports = {
    getUser,
    getUserFirebase,
    postSignup,
	updateUser,
    getUserLiveEvents,
    getUserHostingEvents,
};
