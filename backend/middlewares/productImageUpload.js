const multer = require('multer');

const MIME_TYPES = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/products');
    },
    filename: (req, file, callback) => {
        const name = file.originalname
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/\s/g, '_')
            .replace(/[^a-zA-Z0-9_\.-]/g, '');
        const extension = MIME_TYPES[file.mimetype] || 'jpg';
        callback(null, name + Date.now() + '.' + extension);
    }
});

const upload = multer({ storage: storage }).single('image');
module.exports = upload;