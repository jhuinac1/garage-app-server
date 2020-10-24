//===========================
//DEPENDENCIES
//==========================

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");
const db = mongoose.connection;
const postController = require("./controllers/post-controllers");
const cors = require("cors");


require("dotenv").config();



//===========================
//  PORT
//==========================

const PORT = process.env.PORT || 3003;


//===========================
//  DATABASE
//==========================
const MONGODB_URI = process.env.MONGODB_URI;
//===========================
//  CONNECT TO MONGO
//==========================
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
//===========================
//  ERROR / SUCCESS
//==========================
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));
//===========================
//  MIDDLEWARE
//==========================
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//===========================
//  ROUTES
//==========================
app.use(cors());
app.use("/posts", postController);
// app.use(express.static(path.join(__dirname, "build")));


// app.get("/*", (req, res) => {
//     res.sendFile(path.join(__dirname, "build", "public", "index.html"));
// });

app.get("/", (req, res) => {
    res.redirect("/posts");
})
//===========================
//  LISTENER
//==========================

app.listen(PORT, () => {
    console.log("listening on port: ", PORT);
});