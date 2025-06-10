const ProductModel = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');

module.exports = {
    // Liste tous les produits
    list: async (req, res) => {
        try {
            const products = await ProductModel.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching products', error });
        }
    },

    // Affiche un produit par son ID
    show: async (req, res) => {
        try {
            const product = await ProductModel.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching product', error });
        }
    },

    // Crée un nouveau produit
    create: async (req, res) => {
        try {
            let productObj;
            try {
                productObj = req.body.product ? JSON.parse(req.body.product) : req.body;
            } catch (err) {
                return res.status(400).json({ message: "Le champ product n'est pas un JSON valide." });
            }
            delete productObj._id;
            delete productObj.__v;
            if (req.file) {
                productObj.image = `${req.protocol}://${req.get('host')}/images/products/${req.file.filename}`;
            }
            const newProduct = new ProductModel(productObj);
            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            res.status(400).json({ message: 'Error creating product', error });
        }
    },

    // Modifie un produit existant
    update: async (req, res) => {
        try {
            let productObj;
            try {
                productObj = req.body.product ? JSON.parse(req.body.product) : req.body;
            } catch (err) {
                return res.status(400).json({ message: "Le champ product n'est pas un JSON valide." });
            }
            delete productObj._id;
            delete productObj.__v;
            const product = await ProductModel.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            // Si nouvelle image : suppression de l’ancienne
            if (req.file) {
                if (product.image) {
                    const filename = product.image.split('/images/products/')[1];
                    const imagePath = path.join(__dirname, '..', 'public', 'images', 'products', filename);
                    fs.unlink(imagePath, err => {
                        if (err) console.error('Error deleting old image:', err);
                    });
                }
                productObj.image = `${req.protocol}://${req.get('host')}/images/products/${req.file.filename}`;
            }
            Object.assign(product, productObj);
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(400).json({ message: 'Error updating product', error });
        }
    },

    // Supprime un produit
    delete: async (req, res) => {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            // Suppression du fichier image associé si existe
            if (deletedProduct.image) {
                const filename = deletedProduct.image.split('/images/products/')[1];
                const imagePath = path.join(__dirname, '..', 'public', 'images', 'products', filename);
                fs.unlink(imagePath, err => {
                    if (err) console.error('Error deleting image:', err);
                });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting product', error });
        }
    }
};