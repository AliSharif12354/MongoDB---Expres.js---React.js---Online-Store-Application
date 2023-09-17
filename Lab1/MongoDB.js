let products = require("./Lab1/public/products.json");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
}); 

const productSchema = new mongoose.Schema({
    name: String,
    id: Number,
    price: Number,
    stock: Number,
    reviews: [{rating: Number}],
    dimensions: {x: Number, y: Number, z: Number}
    // Add more fields as needed
});

const Product = mongoose.model("Product", productSchema);


//This gives you a 'client' object that you can use to interact with the database
// mc.connect("mongodb://localhost:27017/", function(err, client) {
// 	if(err) throw err;
// 	console.log("Connected to database.");

// 	//Select the database by name
// 	let db = client.db('store');

// 	//issue commands to the database object
// 	db.collection("products").insertMany(products, function(err,result){
// 		if(err) throw err;

// 		console.log(result);

//     //Close the client connection
//   	client.close();
// 	});

// });
