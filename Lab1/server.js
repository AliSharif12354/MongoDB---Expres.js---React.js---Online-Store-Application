const express = require("express");
const path = require("path");
const cors = require("cors");
const data = require("./Lab1/public/products.json");
const fs = require("fs");
const { writeFile } = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.use('/NameSearch', (req, res, next) => {
    const name = req.query.name.toLowerCase();
    const inStock = req.query.inStock;

    let result = data.filter(data => data.name.toLowerCase().includes(name));

    if (inStock === 'true') {
        result = result.filter(data => data.stock > 0);
    }

    res.json(result);
    next();
});

app.use('/getProduct', (req, res, next) => {
    const id = Number(req.query.id);
    const result = data.filter(data => data.id === id);
    if (req.headers.accept === 'application/json') {
        res.json(result);
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
                    <h1>${result[0].name}</h1>
                    <p>Price: ${result[0].price}</p>
                    <p>Stock: ${result[0].stock}</p>
                    <p>Package Dimensions: ${result[0].dimensions.x} x ${result[0].dimensions.y} x ${result[0].dimensions.z}</p>
                </div>`
            ));
        });

    }
});

app.post('/Create', (req, res) => {
    let product = {
        id: data.length,
        name: req.body.name,
        price: Number(req.body.price),
        dimensions: {
            x: Number(req.body.height),
            y: Number(req.body.width),
            z: Number(req.body.depth)
        },
        stock: Number(req.body.stock)
    }
    data.push(product);
    fs.writeFile('products.json', JSON.stringify(data), err => {
        if (err) { throw err; }
    });
    res.json(product);
    // const newProduct = req.body;
    // data.push(newProduct);
    // res.json(data);
    // next();
});

app.post('/addReview', (req, res) => {
    const id = Number(req.body.id)
    const rating = Number(req.body.rating)

    if (id === undefined || rating === undefined) {
        res.status(400).send("Bad Request");
    }
    else {
        let newReviews = []
        data.map(d => {
            if (d.id === id) {
                if(d.reviews === undefined) d.reviews = []
                d.reviews.push({ rating: rating })
                newReviews = d.reviews
            }
        })
    
        res.json(newReviews);
    }
})

app.use('/getReviews', (req, res) => {
    console.log('in getReviews')
    const id = Number(req.query.id);
    const result = data.filter(data => data.id === id)[0].reviews;
    res.json(result);
})



app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});