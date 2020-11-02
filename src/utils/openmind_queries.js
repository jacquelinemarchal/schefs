/*
 * $1: last_id <int>
 */
const getOpenMind = `
    SELECT * FROM openmind
    WHERE omid >= $1
    ORDER BY time_created ASC
`;

/*
 * $1: user_id   <int> required
 * $2: user_name <string> required
 * $3: body      <string> required
 */
const postOpenMind = `
    INSERT INTO openmind(user_id, user_name, body)
    VALUES($1, $2, $3)
    RETURNING omid
`;

/*
 * $1: omid <int> required
 */
const deleteOpenMind = `
    DELETE FROM openmind
    WHERE omid = $1
    RETURNING omid
`;

module.exports = {
    getOpenMind,
    postOpenMind,
    deleteOpenMind
};
