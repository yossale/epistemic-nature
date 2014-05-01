// set up ========================
var express = require('express');
var app = express();
var DefaultConfiguration = require('./modules/experiment_configurations/default-configuration.js')
var Actions = require('./modules/actions')

var runExperiments = require('./modules/universe-instance')

// configuration =================

app.configure(function () {
    app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
    app.use(express.logger('dev')); 						// log every request to the console
    app.use(express.bodyParser()); 							// pull information from html in POST
    app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

// listen (start app with node server.js) ======================================
app.listen(process.env.PORT || 8080);
console.log("App listening on port " + process.env.PORT || 8080);

// application
app.get('/', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// api routes
app.post('/api/simulate', function (req, res) {

    var params = req.body;
    console.log("api/todos: Request data recieved:" + params);

    var costs = DefaultConfiguration.costs;
    costs[Actions.SEARCH] = params.searchCost;
    costs[Actions.ASK] = params.askCost;

    var expConfiguration = {
        agent: {
            pBelieve: params.pBelieve,
            pLie: params.pLie,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        },
        costs: costs
        //    probabilityOfFindingNewSource: probabilityOfFindingNewSource,
        //    createNewAgentsWhenSurplus: createNewAgentsWhenSurplus
    }

    var results = runExperiments(expConfiguration, 100);

    var graphData = simulationResultsToDataSets(results);

    res.json(graphData);
});


function simulationResultsToDataSets(results) {

    var categories = [];
    var turns = { name: 'Turns', data: [], type: 'area'};
    var size = { name: 'Avg Community Size', data: []};
    var avg = { name: 'Average Turns', data: [], type: 'spline'};

    var avgTurns = 0;

    for (index = 0; index < results.length; index++) {

        var stat = results[index]

        categories.push(index);

        /**
         * stats.turns = turnsCounter;
         stats.avgCommunitySize = communitySizeSum / turnsCounter;
         stats.maxSize = maxSize;
         */
        avgTurns += stat.turns;
        turns.data.push(stat.turns);
        size.data.push(stat.avgCommunitySize);
    }

    avgTurns = avgTurns / results.length
    avg.data = Array.apply(null, {length: results.length}).map(Number.call, function () {
        return avgTurns
    });

    return {
        categories: categories,
        series: [turns, size, avg]
    }
}

//// get all todos
//app.get('/api/todos', function (req, res) {
//    console.log("api/todos")
//    var conf = req.data;
//    console.log("Request data recieved:" + data);
//    var data = {
//        labels: ["January", "February", "March", "April", "May", "June", "July"],
//        datasets: [
//            {
//                fillColor: "rgba(220,220,220,0.5)",
//                strokeColor: "rgba(220,220,220,1)",
//                pointColor: "rgba(220,220,220,1)",
//                pointStrokeColor: "#fff",
//                data: [65, 59, 90, 81, 56, 55, 40]
//            },
//            {
//                fillColor: "rgba(151,187,205,0.5)",
//                strokeColor: "rgba(151,187,205,1)",
//                pointColor: "rgba(151,187,205,1)",
//                pointStrokeColor: "#fff",
//                data: [28, 48, 40, 19, 96, 27, 100]
//            }
//        ]
//    }
//    res.json(data); // return all todos in JSON format
//});



