const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');
const axios = require('axios')


let app = express();
app.set('view engine', 'hbs')
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts') //inform waxOn where to find layouts

app.use(express.static('public'));
//for static files

//related to query string
app.use(express.urlencoded({
    'extended': false
}))

const BASE_API_URL = 'https://ckx-restful-api.herokuapp.com/'

app.get('/', async function (req, res) {
    let response = await axios.get(BASE_API_URL + 'sightings');
    res.render('sightings', {
        'foodSightings': response.data
    })

})

//show create food sighting form
app.get('/food_sighting/create', function (req, res) {
    res.render('food-form')
})

app.post('/food_sighting/create', async function (req, res) {
    let data = {
        'description': req.body.description,
        'food': req.body.food.split(','),
        'datetime': req.body.datetime
    }
    //first arg is api, second is the data that you want to add to api
    await axios.post(BASE_API_URL + 'sighting', data);
    res.redirect('/') //telling browser to go back to '/' route
})

app.get('/food_sighting/edit/:food_sighting_id', async function(req,res){
    //1. we need to know which piece of data to edit hence we need the unique identifier in the url and we extract it
    let foodSightingId = req.params.food_sighting_id;
  //2. extract out the current values of that which we want to change
    let response = await axios.get(BASE_API_URL + 'sighting/' + foodSightingId);
    let foodSighting = response.data;
    res.render('edit_food_form', {
        'description':foodSighting.description,
        'food':foodSighting.food,
        'datetime':foodSighting.datetime.slice(0, -1) //means you don't want the last index (slice last index not inclusive)
    })
    // res.render('edit_food_form')
})

app.post('/food_sighting/edit/:food_sighting_id', async function(req,res){
    let foodSightingId = req.params.food_sighting_id;
    let description = req.body.description;
    let food = req.body.food.split(',');
    let datetime = req.body.datetime;
    //create payload for request
    let payload = {
        'description': description,
        'food': food,
        'datetime': datetime
    }

    //4. send the request
    await axios.put(BASE_API_URL + 'sighting/' + foodSightingId, payload);
    res.redirect('/')
})

app.get('/food_sighting/delete/:food_sighting_id', async function(req,res){
    //req.params; parameters of url body
    let foodSightingId = req.params.food_sighting_id;

    //2. we need the details of the food sighting that we are going to delete;
    let response = await axios.get(BASE_API_URL + 'sighting/' + foodSightingId);
    //once we get the data, then it will be passed into foodSighting
    let foodSighting = response.data;

    //3. render a form asking hte user if they really want to delete the food sighting
    res.render('confirm_delete', {
        'description':foodSighting.description,
        'datetime':foodSighting.datetime

    })
})

app.post('/food_sighting/delete/:food_sighting_id', async function(req, res){
    let foodSightingId = req.params.food_sighting_id;
    await axios.delete(BASE_API_URL + 'sighting/' + foodSightingId);
    res.redirect('/')
})


app.listen(8000, function () {
    console.log('server started')
})