var express = require('express');
const ProductController = require('../controllers/ProductController');
const productImageUpload = require('../middlewares/productImageUpload');
const auth = require('../middlewares/auth');

var router = express.Router();

router.get('/',auth, ProductController.list);

router.get('/:id',auth, ProductController.show);

router.post('/', productImageUpload,auth, ProductController.create);

router.put('/:id', productImageUpload,auth, ProductController.update);

router.delete('/:id',auth, ProductController.delete);


module.exports = router;