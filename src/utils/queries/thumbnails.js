const getThumbnails = `
	SELECT tid, location FROM thumbnails
	WHERE NOT is_used
`;

module.exports = {
	getThumbnails
};
