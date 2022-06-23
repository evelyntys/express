const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
//require('mongodb') will return a Mongo object
//the MongoClient contains many other objects(aka properties)
//but we are only interested in the MongoClient;
//hence put '.MongoClient' at the back of the require;
//MongoClient is mongo shell
const MongoClient = require('mongodb').MongoClient;

//dotenv allows us to create variables
//when we run config on the dontenv, all variables defined are transferred to the environment
const dotenv = require('dotenv').config();

//process is nodejs object automatically available to all nodejs programs -> don't name variables as process
//process variable refers to the current nodejs that is running;
//.env is the environment - where the operating system stores its variables
console.log(process.env);

const app = express();
app.set ('view engine', hbs); //have many other view engines out there that are possible
// -> have to specify hbs 
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

const MONGO_URI = process.env.MONGO_URI
//need to go to the mongo database using mongoclient
async function main(){
    //MongoClient.connection takes in two arguments;
    //connection string and an options object
    const client = await MongoClient.connect(MONGO_URI, {
        'useUnifiedTopology': true //there were different version of Mongo; when this is true, we don't have to care about those version
    });

    const db = client.db('sample_airbnb');
    //conect to db before registering our routes so that the db will be connected once the routes are ready

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


app.listen(3100, function(){
    console.log('server started')
})