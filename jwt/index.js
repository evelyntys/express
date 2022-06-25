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

//a function that is to be a middleware must have three arguments
//req - request
//res -response
//next - is a function, when called, it will pass the request to the next middleware
//if there is no next middleware, then the route function will be called
const dummyMiddleware = function(req,res,next){
    console.log("dummy")
    req.date = new Date();
    //to call the next middleware or the route function(if no more wmiddleware)
    next(); //important: all middleware must eventually call the next() function or res.send()
}
//middleware runs before route functions for all routes
//if want to be selective, can put as an argument before the route function
// app.user(dummyMiddleware);


const checkIfAuthenticated = function(req,res,next){
    let authorizationHeaders = req.headers.authorization;
        if(!authorizationHeaders){
            res.sendStatus(401);
            return
        }
        //get the token
        let token = authorizationHeaders.split(" ")[1];
        

        //verify the token with the token secret
        //after the verification, the token data will be passed to the function specified in the third argument
        jwt.verify(token, process.env.TOKEN_SECRET, function(err, tokenData){
            //if there is error (err will be null or undefined if no error)
            if (err){
                res.sendStatus(401); //res.status() + res.send()
                return;
            } else{
                req.user = tokenData;
            }
        })
        next()
}

async function main() {

    const db = await MongoUtil.connect(MONGO_URI, "tgc18_food_sightings_jwt");
    console.log("Connected to database");
    app.get('/', function(req, res){
        res.send("hello world")
    })

    // POST route cannot be tested via the browser
    app.post('/food_sightings', checkIfAuthenticated, async function(req,res){
        // TODO: validation (as an execrise for the student)
        //check if there is an authorization header
        let description = req.body.description;
        let food = req.body.food;
        // when new Date() is called without an argument, then automatically
        // it will be the server's date and time
        let datetime = req.body.datetime ? new Date(req.body.datetime) : new Date();
        let result = await db.collection('sightings').insertOne({
            'description': description,
            'food': food,
            'datetime': datetime,
            'owner': req.user.user_id
        })
        res.status(201); // set the status code to be 201
        res.send(result);
    })

    app.get('/food_sightings/:id', async function(req,res){
        res.json(await db.collection('sightings').findOne({
            '_id': ObjectId(req.params.id)
        }))
    })

    app.get('/food_sightings', async function(req,res){
        // base query: the query that will get ALL the documents
        let criteria = {};

        if (req.query.description) {
            // {
            // "description": ....    
            //}
            // add the `description` key to the criteria object
            criteria['description'] = {
                '$regex': req.query.description, '$options':'i'
            }
        }

        if (req.query.food) {
            criteria['food'] = {
                '$in': [req.query.food]
            }
        }

        let results = await db.collection('sightings').find(criteria);
        res.status(200);
        // ! toArray() is async
        res.send(await results.toArray());
    } )

    // update
    // patch vs. put (most of the time we will use put)
    app.put('/food_sightings/:id', async function(req,res){
        let description = req.body.description;
        let food = req.body.food;
        let datetime = req.body.date ? new Date(req.body.date) : new Date();
        let results = await db.collection('sightings').updateOne({
            '_id': ObjectId(req.params.id)
        },{
            '$set':{
                'description': description,
                'food': food,
                'datetime': datetime
            }
        });
        res.status(200);
        res.json(results);
    })
    
    // delete
    app.delete('/food_sightings/:id', async function(req,res){
        let results = await db.collection('sightings').deleteOne({
            '_id': ObjectId
        });
        res.status(200);
        res.json({
            'status':'Ok'
        })
    })

    //user signup 
    //for user signup, we need the user email and user password
    //POST => creating
    //if the endpoint is POST/users => creating new users
    //we assume req.body contains `password` and `email`
    app.post('/users', async function(req,res){
        let newUser = {
            'email': req.body.email,
            'password': req.body.password
        }
        await db.collection('users').insertOne(newUser);
        res.status(201);
        res.json({
            'message': 'New user created successfully'
        })
    })
    //does not deal with document
    //RESTFUL API - URL suggest dealing with a resource ('piece of data')
    //when the user login, the client must pass us the password and email
    app.post('/login', async function(req,res){
        //attempt to find a document with the same password and email given
        let user = await db.collection('users').findOne({
            'email':req.body.email,
            'password': req.body.password
        })
        //only if user is not defined or null
        if (user){
            //the token can store data, important to ensure jwt does not contain any sensitive data
            let token = jwt.sign({
                'email': req.body.email,
                'user_id': user._id
            }, process.env.TOKEN_SECRET, {
                'expiresIn': '15m', //m for mins, h for hours, w for weeks, d for days
                //once expire, user will have to login again and get new accesstoken
            });
            res.json({
                'accessToken': token
            })
        }
        else{
            res.status(401);
            res.json({
                //do not send back message telling user either the username/password is wrong if not hacker will know which is wrong
                'message': 'invalid user name or password'
            })
        }
    } )
} 
main();


app.listen(3000, function(){
    console.log("Server has started")
})