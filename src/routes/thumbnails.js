const { verifyFirebaseIdToken } = require('../middleware/auth');
const upload = require('../utils/multer');

const express = require('express');
const pool = require('../utils/db');
const queries = require('../utils/queries/thumbnails');

const router = express.Router();


/*
 * GET /api/thumbnails
 * Get list of available thumbnails for event builder.
 *
 * Response:
 *  200: successfully retrieved
 *    <object>
 *      tid           <int>
 *      location      <string>
 *      is_used	      <boolean>
 *  500: other postgres error
 */
router.get('', (req, res) => {
    pool.query(queries.getThumbnails, (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(200).json(q_res.rows);
    });
});

/*
 * POST /api/thumbnails
 * Upload new thumbnail.
 *
 * Request Body:
 *  <object>
 *    img_thumbnail <File>
 *
 * Response:
 *  201: successfully uploaded
 *  406: missing image/file
 *  500: postgres error
 */
router.post('', verifyFirebaseIdToken, upload.single('img_thumbnail'), (req, res) => {
    if (!req.file) {
        res.status(406).json({ err: 'no file uploaded' });
        return;
    }

    const thumb_path = '/images/' + req.file.filename;
    pool.query(queries.uploadThumbnail, [ thumb_path ], (q_err, q_res) => {
        if (q_err)
            res.status(500).json({ err: 'PSQL Error: ' + q_err.message });
        else
            res.status(201).send()
    });
});

module.exports = router;
