const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    'extended':false,

}))

app.get('/', function(req, res){
    res.render('index')
})

app.post('/', function(req,res){
    res.send('submitted xx')
})

app.listen(3000, function(){
    console.log('server started')
})