var express = require('express');
const ProductController = require('../controllers/ProductController');
var router = express.Router();

router.get('/', ProductController.list);
router.get('/:id', ProductController.show);

router.post('/', ProductController.create);

module.exports = router