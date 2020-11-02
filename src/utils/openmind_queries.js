/*
 * $1: time_from <string> - in UTC format 'YYYY-MM-DDTHH:MM:SS.SSSZ'
 * $2: time_to   <string> - in UTC format 'YYYY-MM-DDTHH:MM:SS.SSSZ'
 */
const getOpenMind = `
    SELECT * FROM openmind
    WHERE (
        COALESCE($1) = '' OR
        time_created >= $1::TIMESTAMPTZ
    ) AND (
        COALESCE($2) = '' OR
        time_created <= $2::TIMESTAMPTZ
    )
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
