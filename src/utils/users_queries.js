/*
 * $1: uid <int> required
 */
const getUser = `
    SELECT * FROM users
    WHERE fb_uid = $1
`;

module.exports = {
    getUser,
};
