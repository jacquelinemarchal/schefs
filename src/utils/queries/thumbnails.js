const getThumbnails = `
	SELECT tid, location FROM thumbnails
	WHERE NOT is_used
`;

/*
 * $1: tid <int> required
 */
const checkThumbnail = `
    SELECT tid FROM thumbnails
    WHERE tid = $1
    AND NOT is_used
`;

/*
 * $1: tid <int> required
 */
const setThumbnailUsed = `
    UPDATE thumbnails
    SET is_used = true
    WHERE tid = $1
`;

/*
 * $1: location <string> required
 */
const uploadThumbnail = `
    INSERT INTO thumbnails(
        location,
        is_used
    )
    VALUES ($1, false)
    RETURNING tid
`;

module.exports = {
	getThumbnails,
    checkThumbnail,
    setThumbnailUsed,
    uploadThumbnail,
};
