const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');

const fruitPrices = {
    'apple' : 3,
    'durian' : 15,
    'orange' : 6,
    'bananas' : 4
}


let app = express();
app.set('view engine', 'hbs')
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts') //inform waxOn where to find layouts

//related to query string
app.use(express.urlencoded({
    'extended': false //usually false for processing html forms
}))

app.get('/', function (req, res) {
    //req is request from the client; all data from client are inside req
    //res is for us to send back to the client
    res.send('hi') //you mmust ensure that the function will eventually reach at least one res.send
    //only one res.send can be executed()
    //res.render(), res.json(), res.status() and res.send()
    //all send back response, only one of them can be executed per function
    //take note: res.send or res.json etc is not a return (i.e. does not end the function)
})

app.get('/fruits', function (req, res) {
    res.render('fruit-form')
})

app.post('/fruits', function (req, res) {
    //res.send(req.body) //send body of form back to client for visual inspection
    let fruits = [];
    //if req.body.items is already an array, no further processing
    //state variable == it represents the answer to a problem
    if (Array.isArray(req.body.items)) {
        fruits = req.body.items;
    }
    else {//truthly check
        if (req.body.items) {
            fruits = fruits = [req.body.items]
        }
        else {
            fruits = []; //can be removed since fruits was set to be [] from the start
        }
    }

    // if statements
    // let total = 0;
    // for (let eachFruit of fruits){
    //     if(eachFruit == 'apple'){
    //         total += 3;
    //     }
    //     if (eachFruit == 'durian'){
    //         total +=15;
    //     }
    //     if (eachFruit == 'orange'){
    //         total += 6;
    //     }
    //     if (eachFruit =='bananas'){
    //         total+=4;
    //     }
    // }

    //switch
    // let total = 0;
    // for (let eachFruit of fruits) {
    //     switch (eachFruit) {
    //         case 'apple':
    //             total += 3;
    //             break;
    //         case 'durian':
    //             total += 15;
    //             break;
    //         case 'orange':
    //             total += 6;
    //             break
    //         case 'banana':
    //             total += 4;
    //             break
    //     }
    // }


    //lookup table; associate value with key
    let total = 0;
    for (let eachFruit of fruits){
        let price = fruitPrices[eachFruit];
        total += price;
    }

    //must know what each total refers to
    res.render('total', {
        'total': total
    })

    //res.send(fruits) --> res.send is not a return function since this line will still be triggered after prev res.send

    //if req.body.items is a single item then convert it to an array consisting of just that item
    //if req.body.items is undefined (or otherwise falsely), then the result is an empty array
})

//one route to display the form


app.listen(8000, function () {
    console.log('server started')
})