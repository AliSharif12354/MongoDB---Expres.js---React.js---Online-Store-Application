const express = require("express");
const path = require("path");
const cors = require("cors");
const data = require("./Lab1/public/products.json");
const fs = require("fs");
const { writeFile } = require("fs");

const { MongoClient, ServerApiVersion } = require('mongodb');
const { count } = require("console");
const uri = "mongodb+srv://ali12354:ali12354@cluster0.cpdw4uq.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
    await client.connect();
    console.log("Connected successfully to server");

}

run().catch(console.dir);

const database = client.db("store");
const products = database.collection("Products");

const app = express();

app.use(express.json());
app.use(cors());

app.use('/NameSearch', async (req, res, next) => {
    const name = req.query.name.toLowerCase();
    const inStock = req.query.inStock;

    //Case insensitive Regex
    const regexName = new RegExp(name, "i");
    let found = await products.find({name : {$regex: regexName}}).toArray(function(err, res){
		if(err) throw err;
    })

    if (inStock === 'true') {
        found = found.filter(item => item.stock > 0);
    }

    res.json(found);
    next();
});

app.use('/getProduct', async (req, res, next) => {
    const id = Number(req.query.id);
    const found = await products.findOne({id : id}, function(err, res){
		if(err) throw err;
    })

    if(found === null) {
        res.status(404).send("Not Found");
        res.json(null)
        return;
    }
    if (req.headers.accept === 'application/json') {
        res.json(found);
        next();
    } else {
        fs.readFile(path.resolve("./Lab1/index.html"), "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send("An error occurred");
            }
            return res.send(data.replace(
                '<div id="root"></div>',
                `<div id="root">
                    <h1>${found[0].name}</h1>
                    <p>Price: ${found.price}</p>
                    <p>Stock: ${found.stock}</p>
                    <p>Package Dimensions: ${found.dimensions.x} x ${found.dimensions.y} x ${found.dimensions.z}</p>
                </div>`
            ));
        });

    }
});

app.get('/Orders', async (req, res, next) => {
    const ordersCollection = database.collection("Orders");
    console.log("Orders API GET Request")
    const found = await ordersCollection.find().toArray(function(err, res){
        if(err) throw err;
    })
    console.log(found)
    res.json(found);
    next();
});

app.get('/Orders/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    const ordersCollection = database.collection("Orders");
    const found = await ordersCollection.find({id:id}, function(err, res){ 
        if(err) throw err;
    }).toArray()
    console.log(found)
    res.json(found[0]);
    next();
});


app.post('/Create', async (req, res) => {
    let num = 0
    num = await products.countDocuments({}, function(err, count){
        if(err) throw err;
        num = count;
    })
    console.log(num)
    let product = {
        id: num,
        name: req.body.name,
        price: Number(req.body.price),
        dimensions: {
            x: Number(req.body.height),
            y: Number(req.body.width),
            z: Number(req.body.depth)
        },
        stock: Number(req.body.stock)
    }

    result = products.insertOne(product, function(err, res){
        if(err) throw err;
    })
    
    res.json(result);
    // const newProduct = req.body;
    // data.push(newProduct);
    // res.json(data);
    // next();
});

app.post('/addReview', async (req, res) => {
    const id = Number(req.body.id)
    const rating = Number(req.body.rating)

    if (id === undefined || rating === undefined) {
        res.status(400).send("Bad Request");
    }
    else {
        let newReviews = []
        const found = await products.findOne({id : id}, function(err, res){
            if(err) throw err;
        })

        if(found.reviews === undefined) found.reviews = [];
        found.reviews.push({ rating: rating })


        const updated = await products.updateOne({id: id}, {$set: {reviews: found.reviews}}, function(err,result){
            if(err) throw err;
        })

        console.log(updated)
    
        res.json(newReviews);
    }
})

app.post('/orders', async (req, res) => {
    const name = req.body.name.toLowerCase();
    const order = req.body.products;
    const ordersCollection = database.collection("Orders");
    const num = await ordersCollection.countDocuments({}, function(err, count){
        if(err) throw err;
        num = count;
    })

    const ordersDoc = {
        name: name,
        order: [],
        id: num
    }

    for (item in order) {
        const regexName = new RegExp(order[item].name, "i");

        const found = await products.findOne({name : {$regex: regexName}}, function(err, res){
            if(err) throw err;
        })

        if(found == null) {
            console.log("Item not found in store inventory")
            res.status(409).send("Item not found in store inventory");
            return;
        }
        if(found.stock < order[item].quantity) {
            console.log("Not enough stock for item: ", order[item].name)
            res.status(409).send("Not enough stock for item: " + order[item].name);
            return; 
        }

        ordersDoc.order.push(order[item]);
    }

    //At this point, we are certain all order products exist and are in stock, we can update stock since we are certain to transact order
    for (item in order) {
        const regexName = new RegExp(order[item].name, "i");
        const found = await products.findOne({name : {$regex: regexName}}, function(err, res){
            if(err) throw err;
        })
        found.stock -= order[item].quantity;

        const updated = await products.updateOne({name : {$regex: regexName}}, {$set: {stock: found.stock}}, function(err,result){
            if(err) throw err;
        })
    }

    //Finally, add to order database
    const result = await ordersCollection.insertOne(ordersDoc, function(err, res){
        if(err) throw err;
    })
    console.log("Order created successfully")
    res.status(201).send("Order created successfully");
})




app.use('/getReviews', async (req, res) => {
    const id = Number(req.query.id);
    const found = await products.findOne({id : id}, function(err, res){
		if(err) throw err;
		console.log(res);
    })
    result = found.reviews;
    res.json(result);
})



app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});