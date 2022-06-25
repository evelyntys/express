const express = require('express');
require('dotenv').config();  // for .env file (to load the variables of the .env file into the OS)
const MongoUtil = require('./MongoUtil'); // require in the MongoUtil.js file (it's the same directory as our index.js)
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();


// ENABLE CROSS SITE ORIGIN RESOURCES SHARING
app.use(cors());

// RESTFUL API expects data sent to the endpoint
// should be in JSON format, we need tell Express
// to configure all recieved data to be converted to JSON
app.use(express.json());

async function main(){
    app.get('/', function(req,res){
        res.send('hello world')
    })
}