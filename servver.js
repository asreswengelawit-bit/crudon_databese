const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
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