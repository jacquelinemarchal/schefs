/*
 * no parameters
 */
const getUsers = `
    SELECT * FROM users
`;

/*
 * $1: uid <int> required
 */
const getUser = `
    SELECT * FROM users
    WHERE uid = $1
`;

module.exports = {
    getUsers,
    getUser
};
