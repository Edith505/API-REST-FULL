var express = require('express');
const ProductController = require('../controllers/ProductController');
const productImageUpload = require('../middlewares/productImageUpload');

var router = express.Router();

router.get('/', ProductController.list);

router.get('/:id', ProductController.show);

router.post('/', productImageUpload, ProductController.create);

router.put('/:id', productImageUpload, ProductController.update);

router.delete('/:id', ProductController.delete);


module.exports = router;