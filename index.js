const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

//database connection with MongoDB
require('dotenv').config()
mongoose.connect(process.env.MONGO_URL);

app.get("/", (req, res)=> {
    res.send("Express app is Running");
})



const Product = mongoose.model("Product", {
    id : {
        type : Number,
        required : true,
    },
    medicineName : {
        type : String,
        required : true,
    },
    company : {
        type : String,
        required : true,
    },
    mrp : {
        type : Number,
        required : true,
    },
    rate : {
        type : Number,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now,
    },
    avilable : {
        type : Boolean,
        default : true,
    },
})

app.post('/addproduct', async (req, res)=> {
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id = 1;
    }
    const product = new Product({
        id : id,
        medicineName : req.body.medicineName,
        company : req.body.company,
        mrp : req.body.mrp,
        rate : req.body.rate,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success : true,
        medicineName : req.body.medicineName,
    })
})


//Creating API for Deleting Products

app.post('/removeproduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOneAndDelete({ id: productId });
    if (product) {
      console.log("Removed");
      res.json({ success: true, name: product.medicineName });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


//Creating API for Getting all Products

app.get('/allproducts', async (req, res)=> {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})


// //Creating API for Getting a single product by ID
app.get('/product/:id', async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});







//update
app.put('/updateproduct/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const updatedProduct = await Product.findOneAndUpdate(
        { id: productId },
        {
          medicineName: req.body.medicineName,
          company: req.body.company,
          mrp: req.body.mrp,
          rate: req.body.rate
        },
        { new: true }
      );
      if (updatedProduct) {
        console.log("Product updated:", updatedProduct);
        res.json({ success: true, product: updatedProduct });
      } else {
        res.status(404).json({ success: false, message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });













app.listen(port, (error)=> {
    if(!error) {
        console.log("Server Running on port" + port)
    }
    else {
        console.log("Error : " + error)
    }
})