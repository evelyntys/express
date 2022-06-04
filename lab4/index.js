const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on')

const app = express();

app.set('view engine', 'hbs')
app.use(express.static('public'));

waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts')

app.get('/', function(req, res){
    res.render('index')
})

app.get('/submit-fault/', function(req, res){
    res.render('submit-fault')
})

app.get('/admin/', function(req, res){
    res.render('admin')
})


app.listen(3000, function(){
    console.log('server started')
})