const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts');

app.get('/', function(req, res){
    res.render('index')
})

app.use(express.urlencoded({
    'extended':false
}))

app.get('/add-food', function(req,res){
    res.render('add-food')
})

function processCheckbox(checkboxes){
    let values = checkboxes;
    if(!values){
        values = [];
    }
    else if (!Array.isArray(checkboxes)){
        values = [values]
    }
    return values
}

app.post('/add-food', function(req,res){
    let foodName = req.body.foodName;
    let calories = req.body.calories;
    let tags = processCheckbox(req.body.tags);
    res.render('display-food-summary', {
        'foodName': foodName,
        'calories': calories,
        'tags':tags
    })
})

app.get('/calculate-bmi', function(req,res){
    res.render('calculate-bmi')
})

app.post('/calculate-bmi', function(req, res){
    //default response given is string so better to convert to numbers
    let height = Number(req.body.height);
    let weight = Number(req.body.weight);
    let units = req.body.units
    let bmi=0;
    if (units =='metric'){
        bmi = weight/height**2
    }
    else{
        weight = weight * 2.20462;
        height = height * 39.3701;
        bmi = (weight/height**2) * 703
    }
    res.render('bmi', {
        'bmi': bmi
    })
})

app.get('/fruits', function(req, res){
    res.render('fruits')
})

let price = {
    apple: 3,
    durian: 15,
    orange: 6,
    banana: 4
}

app.post('/fruits', function(req, res){
    let items = processCheckbox(req.body.items)
    console.log(items)
    let cost = 0;
    for (let each of items){
        cost = cost + price[each]
    }
    res.render('cost', {
        'cost':cost
    })
})

app.listen(3000, function(){
    console.log('server started')
})