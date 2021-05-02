const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const imageDir = process.env.ROOT_DIR + 'public/images/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imageDir),
    filename: (req, file, cb) => {
        let filetype = '';
        if (file.mimetype === 'image/gif')
            filetype = 'gif';
        else if (file.mimetype === 'image/png')
            filetype = 'png';
        else if (file.mimetype === 'image/jpeg')
            filetype = 'jpg';
        
        cb(null, uuidv4() + '.' + filetype);
    },
});

module.exports = multer({ storage: storage });
