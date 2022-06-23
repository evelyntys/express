const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');
const axios = require('axios');

let app = express();
app.set('view engine', 'hbs');
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts')


app.use(express.static('public'));
//for static files

app.use(express.urlencoded({
    'extended': false
}))

const BASE_API_URL = 'https://ckx-movies-api.herokuapp.com/'

app.get('/movies', async function(req,res){
    let response = await axios.get(BASE_API_URL + 'movies');
    res.render('movies', {
        'movie':response.data
    })
})

// let movie_id = [];

// async function movieId(){
//     let response = await axios.get(BASE_API_URL + 'movies')
//     for (let each of response.data){
//         movie_id.push(each.id)
//     }
// }

app.get(`/movies/search/:movie_id`, async function(req,res){
    let response = await axios.get(BASE_API_URL + 'movies')
    for (let each of response.data){
        if (req.params['movie_id'] == each.id){
            res.render('by-id', {
                'oneMovie': each
            })
        }
    }
})

app.get('/movies/create', function(req,res){
    res.render('createmovie')
    // res.render('createmovie')
})

app.post('/movies/create', async function(req,res){
    let data = {
        'title':req.body.title,
        'plot':req.body.plot
    }
    //follow route of api documentation
    await axios.post(BASE_API_URL + '/movie/create', data);
    res.redirect('/movies')
})

app.get('/movies/edit/:movie_id', async function(req, res){
    let movieId = req.params.movie_id;
    let response = await axios.get(BASE_API_URL + 'movie/' + movieId)
    let movieDetails = response.data;
    res.render('edit_movie', {
        'title': movieDetails.title,
        'plot': movieDetails.plot,
        'id': movieDetails.id
    })
})

app.post('/movies/edit/:movie_id', async function(req, res){
    let movieId = req.params.movie_id;
    let title = req.body.title;
    let plot = req.body.plot;
    let payload = {
        'title': title,
        'plot':plot
    }
    //to access api so we have to follow the rules of the API
    await axios.patch(BASE_API_URL + 'movie/' + movieId, payload);
    res.redirect('/movies')
})

app.get('/movies/delete/:movie_id', async function(req, res){
    let movieId = req.params.movie_id;
    let response = await axios.get(BASE_API_URL + 'movie/' + movieId);
    let movieDetails = response.data;
    res.render('delete', {
        'title': movieDetails.title,
        'plot': movieDetails.plot
    })
})

app.post('/movies/delete/:movie_id', async function(req, res){
    let movieId = req.params.movie_id;
    await axios.delete(BASE_API_URL + '/movie/' + movieId)
    res.redirect('/movies')
})

app.listen(3100, function(){
    console.log('server started')
})