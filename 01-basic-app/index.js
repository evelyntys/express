//we need to use Express for this, we are going to include
const express = require('express'); //express will be an object || require function only exists in node.js, not browser based javascript
const res = require('express/lib/response');
// for script src, it only exists in browser-based javascript
//node.js will look for the express folder inside node_modules and locate the index.js there, which will return an object
//object will be stored into const express;

//create an express application
let app = express();
//add routes
//a route is a url on our server
//first argument: a path of the url
//second argument: a function that happens when a client tries to access the path
app.get('/', function(req, res){
    //first argument -- request from the client
    //second argument --response which we are going to send back
    res.send('HELLO WORLD')
})

app.get('/about us', function(req, res){
    res.send('<h1>about us</h1><p>about our company</p>')})

//score better on seo;
//any words or sequence of characters that has : in front is a parameter or argument
app.get('/hello/:firstname', function(req, res){
    //res.send() can send back a string or an integer
    //but if it is an integer it must be a HTTP status code e.g. 200, 404, 500
    res.send('hi,' + req.params.firstname);
})

//we expect the url to have 2 params in the query string which will be a and b
//e.g. calculate?a=3&b=4;
app.get('/calculate', function(req,res){
    //all query string parameters will be in the query object
    let a = req.query.a;
    let b = req.query.b;
    res.send(a+b);
})

//any routes put after app.listen will be ignored
//start the server
//first arg: portnumber
//second arg: function
app.listen(3000, function(){
    console.log('server started')
})

//must restart server before new change will be reflected each time
//-> control c, then node ~jsfile.js