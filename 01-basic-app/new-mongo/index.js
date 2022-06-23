const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const {connect} = require('./MongoUtil')
//we need the ./ in front of our own custom modules because without it, NodeJs will assume that we are requirting from the node_modules folder
//want index.js to be in same folder as .mongoutil

const dotenv = require('dotenv').config();


console.log(process.env);

const app = express();
app.set ('view engine', hbs); //have many other view engines out there that are possible
// -> have to specify hbs 
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

const MONGO_URI = process.env.MONGO_URI
//need to go to the mongo database using mongoclient

//reusable function; inputs are not hardcoded, and return other function aspects

async function main(){

    const db = await MongoUtil.connect(MONGO_URI, 'sample_airbnb')

    app.get('/test', async function(req, res){
        //connect to a database
        //have to use .collection unlike mongoshell
        //use .toArray() to convert the results to an array of js objects
        let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
        res.send(data)

    })

    app.get('/', function(req, res){
        res.render('hello.hbs');
    })
}


main()


app.listen(3200, function(){
    console.log('server started')
})