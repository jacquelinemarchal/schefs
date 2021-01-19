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

module.exports = {
    getUser,
    getUserFirebase,
    postSignup,
	updateUser,
};
