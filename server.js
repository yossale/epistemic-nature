// set up ========================
var express = require('express');
var app = express();

var UniverseInstance = require('./modules/universe-instance')

// configuration =================

app.configure(function () {
    app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
    app.use(express.logger('dev')); 						// log every request to the console
    app.use(express.bodyParser()); 							// pull information from html in POST
    app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

// application
app.get('/', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// api routes

// get all todos
app.get('/api/todos', function (req, res) {
    console.log("api/todos")
    var todos = [
        {text: 'text A'},
        {text: 'text B'}
    ];
    res.json(todos); // return all todos in JSON format
});

// create todo and send back all todos after creation
app.post('/api/todos', function (req, res) {

    var expConf = {};
    var newExperiment =

        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function (err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

});

// delete a todo
app.delete('/api/todos/:todo_id', function (req, res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

