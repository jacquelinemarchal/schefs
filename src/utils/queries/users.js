/*
 * $1: uid <int> required
 */
const getUser = `
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


module.exports = {
    getUser,
    postSignup,
};
