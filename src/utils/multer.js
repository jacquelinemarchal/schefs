const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '~/'),
    filename: (req, file, cb) => {
	console.log(file);
	let filetype = '';
	if (file.mimetype === 'image/gif')
	    filetype = 'gif';
	else if (file.mimetype === 'image/png')
	    filetype = 'png';
	else if (file.mimetype === 'image/jpeg')
	    filetype = 'jpg';
	
	cb(null, 'image-' + Date.now() + '.' + filetype);
    },
});

module.exports = multer({ storage: storage });
