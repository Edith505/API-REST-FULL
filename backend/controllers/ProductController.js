var ProductModel = require('../models/ProductModel');

module.exports = {
    list: async (req, res) => {
        try {
        const products = await ProductModel.find();
        res.status(200).json(products);
        } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
        }
    },
    
    show: async (req, res) => {
        try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
        } catch (error) {
        res.status(500).json({ message: 'Error fetching product', status: 500 });
        }
    },
    
    create: async (req, res) => {
        try {
        const newProduct = new ProductModel(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
        } catch (error) {
        res.status(400).json({ message: 'Error creating product', status: 400});
        }
    }
    

}