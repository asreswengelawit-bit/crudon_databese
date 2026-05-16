const express = require('express');
const { default: mongoose } = require('mongoose');

const app = express();


// MIDDLEWARE
app.use(express.static('public'));
app.use(express.json());


// SERVER
app.listen(3000, () => {
    console.log("server is running on port 3000");
});


// HOME ROUTE
app.get('/', (req, res) => {
    res.send("hello from node api");
});


// DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/testdb')
.then(() => console.log('Connected'))
.catch(err => console.log(err));


// SCHEMA
const ProductSchema = new mongoose.Schema({

    name: String,

    price: Number,

    currency: String

});


// MODEL
const Product = mongoose.model('Product', ProductSchema);




// ======================
// GET PRODUCTS
// ======================
app.get('/products', async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




// ======================
// CREATE PRODUCT
// ======================
app.post('/products', async (req, res) => {

    try {

        const product = new Product({

            name: req.body.name,

            price: req.body.price,

            currency: req.body.currency

        });

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




// ======================
// UPDATE PRODUCT
// ======================
app.put('/products/:id', async (req, res) => {

    try {

        const updatedProduct = await Product.findByIdAndUpdate(

            req.params.id,

            {

                name: req.body.name,

                price: req.body.price,

                currency: req.body.currency

            },

            { new: true }

        );

        if (!updatedProduct) {

            return res.status(404).json({
                message: 'Product not found'
            });

        }

        res.json(updatedProduct);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




// ======================
// DELETE PRODUCT
// ======================
app.delete('/products/:id', async (req, res) => {

    try {

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {

            return res.status(404).json({
                message: 'Product not found'
            });

        }

        res.json({
            message: 'Product deleted successfully',
            product: deletedProduct
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});