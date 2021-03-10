const getThumbnails = `
	SELECT tid, location FROM thumbnails
	WHERE NOT is_used
`;

/*
 * $1: location <string> required - location of old thumbnail
 * $2: tid      <int>    required - tid of replacing thumbnail
 */
const replaceThumbnail = `
    WITH thumb AS (
        UPDATE thumbnails
        SET is_used = false
        WHERE location = $1
    )
    UPDATE thumbnails AS t
    SET t.is_used = true
    WHERE t.tid = $2
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
 * $1: tid <int> required
 */
const setThumbnailUnused = `
    UPDATE thumbnails
    SET is_used = false
    WHERE tid = $2
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
    replaceThumbnail,
    checkThumbnail,
    setThumbnailUsed,
    setThumbnailUnused,
    uploadThumbnail,
};
