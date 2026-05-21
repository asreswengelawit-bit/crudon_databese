
const express = require('express');

const mongoose = require('mongoose');

const multer = require('multer');

const path = require('path');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
// ======================
// CREATE EXPRESS APP
// ======================
const app = express();


// ======================
// MIDDLEWARE
// ======================
app.use(express.json());

app.use(express.static('public'));

app.use('/uploads', express.static('uploads'));


// ======================
// DATABASE CONNECTION
// ======================
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('MongoDB Connected'))

.catch(err => console.log(err));


// ======================
// IMAGE UPLOAD SETUP
// ======================
const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(null, 'uploads/');

    },

    filename: function(req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));

    }

});


const upload = multer({

    storage: storage

});


// ======================
// PRODUCT SCHEMA
// ======================
const ProductSchema = new mongoose.Schema({

    name: String,

    price: Number,

    currency: String,

    category: String,

    image: String

});


// ======================
// PRODUCT MODEL
// ======================
const Product = mongoose.model('Product', ProductSchema);




// ======================
// HOME ROUTE
// ======================
app.get('/', (req, res) => {

    res.send('Welcome to Product CRUD API');

});




// ======================
// GET ALL PRODUCTS
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
app.post('/products', upload.single('image'), async (req, res) => {

    try {

        const product = new Product({

            name: req.body.name,

            price: req.body.price,

            currency: req.body.currency,

            category: req.body.category,

            image: req.file ? req.file.filename : ''

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
app.put('/products/:id', upload.single('image'), async (req, res) => {

    try {

        const updatedData = {

            name: req.body.name,

            price: req.body.price,

            currency: req.body.currency,

            category: req.body.category

        };


        // UPDATE IMAGE IF EXISTS
        if (req.file) {

            updatedData.image = req.file.filename;

        }


        const updatedProduct = await Product.findByIdAndUpdate(

            req.params.id,

            updatedData,

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

            message: 'Product deleted successfully'

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});




// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});

