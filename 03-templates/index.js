//1. require in express
const express = require ('express');

//1b. require in hbs
const hbs = require('hbs');

//2. create the express application
const app = express();

//2b. tell express that we want to use hbs as the template engine
app.set('view engine', 'hbs');

//2c. tell express where to find static files
//static files = browser javascript, images, css
app.use(express.static('public')); //the public here refers to the public folder

//3. put in the routes
app.get('/', function(req, res){
    res.render('index.hbs')
})

app.get('/hello/:firstname/:lastname', function(req, res){
    let fname = req.params.firstname;
    let lname = req.params.lastname;
    //the second argument to render, allows us to pass variables to the hbs file
    //the key is the variable in the hbs file, the value is the value for that variable
    res.render('hello.hbs', {
        'firstName':fname,
        'lastName':lname
    })
})

//express knows that hbs files are inside the views folder -> no need to put views.index.hbs

//4. start server
app.listen(3000, function(){
    console.log('server started')
})