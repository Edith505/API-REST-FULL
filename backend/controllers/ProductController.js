var ProductModel = require('../models/ProductModel');
var UserModel = require('../models/UserModel');

module.exports = {

  list : (req, res) => {
    ProductModel.find((err, products) => {
        if (err) {
          return res.status(500).json({ 
            message: 'Error fetching products', error: err 
        });
        }
        return res.status(200).json({
            status : 200, 
            products: products});
      });
  }
};

