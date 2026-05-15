const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
//put mathod works when we write app.use(express.json());at the top like blow
app.use(express.json());
app.listen (3000,() =>{
    console.log("server is runing on port 3000");
});
app.get ('/',(req,res)=>{
    res.send("hello from node api")
});

mongoose.connect('mongodb://127.0.0.1:27017/testdb')
.then(() => console.log('Connected'))
.catch(err => console.log(err));
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number
});

const Product = mongoose.model('Product', ProductSchema);
// i mad a misstacke beror the const product ,i was write Product.findByIdAndUpdate();at the top
Product.findByIdAndUpdate();
Product.findByIdAndDelete();
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
app.post('/products', async (req, res) => {

    try {

        const product = new Product({
            name: req.body.name,
            price: req.body.price
        });

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});//use to updated our databese product 
app.put('/products/:id', async (req, res) => {

    try {

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                price: req.body.price
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