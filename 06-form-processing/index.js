//require in dependencies
const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');

//1. set up express
const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));; //whenever express receives a request for a static file, it will look for it in the public folder
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts');

app.get('/', function(req, res){
    res.send('hello world')
})


app.get('/add-food', function(req,res){
    res.render('add')
})

//!important, set up express to process forms
app.use(express.urlencoded({
    'extended' : false,
     //use extended: true if processing objects in a form
}))

function processCheckbox(checkboxes){
    let values = checkboxes;
    if (!values){
        values = [];
    }
    else if (!Array.isArray(checkboxes)){
        values = [values]
    }
    return values
}

app.post('/add-food', function(req,res){
    //the content of the form is in req.body
    console.log(req.body);
    let foodName = req.body.foodName;
    let calories = req.body.calories;
    let meal = req.body.meal;

    //if 2 or more checkboxes are checked, we just save it as it is
    //if only 1 checkbox, turn it into an array with just that checkbox's value
    //if no checkboxes is checked, the it becomes an empty array

    let tags = processCheckbox(req.body.tags);
    
    //tags will be undefined if user never selects any checkboxes
    //undefined is falsely value => !tags == !undefined == !false == true
    
    //1. easy to understand method
    // if (!tags){
    //     tags= [];
    // }
    // else if (Array.isArray(tags) == false){
    //     //tags is either an array or a string
    //     tags =[tags]
    // }

    //2. nested ternary operators
    // tags = Array.isArray(tags) ? tags : tags ? [tags] : []

    //3. logical short circuit
    // tags = tags || [];
    // tags == Array.isArray(tags) ? tags : [tags];


    console.log('tags==> ', tags)
    res.render('result', {
        'foodName': foodName,
        'meal': meal,
        'calories': calories,
        'tags' : tags

    })
})


app.listen(3000, function(){
    console.log('server started')
})