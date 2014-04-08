/**
 * Created by yossale on 4/6/14.
 */

var UniverseInstance = require('./universe-instance');
var Actions = require('./actions')

var costs = {}
costs[Actions.CONSUME] = 1;
costs[Actions.ASK] = 3;
costs[Actions.SEARCH] = 5;

var experiments = {

    'utopian experiment': {
        maxSupportedCommunitySize: 100,
        initialCommunitySize: 10,
        initialUserEnergy: 100,
        costs: costs,
        agent: {
            pBelieve: 1.0,
            pLie: 0.0,
            pSearch: 0.5,
            credibilityBias: 1.0
        },
        resource: {
            initialResourceCapacity: 100,
            consumptionRate: 10
        }
    },

    'all Lies Experiment': {

        maxSupportedCommunitySize: 100,
		initialCommunitySize: 10,
        initialUserEnergy: 100,
        costs: costs,
        agent: {
            pBelieve: 0.0,
            pLie: 1.0,
            pSearch: 0.5,
            credibilityBias: 1.0
        },
        resource: {
            initialResourceCapacity: 100,
            consumptionRate: 10
        }
	}


}

var statistics = {}
Object.keys(experiments).forEach(function(experimentName){

    var runs = 1;
    var sumTurns = 0;
    var maxTurns = 0;
    var exp = experiments[experimentName];

    for (index = 0; index < runs; index++) {

        var experiment = new UniverseInstance(exp);

        console.log("Running experiment: " + experimentName + " take: " + index);
        var stats = experiment.run();
        sumTurns += stats.turns;
        if (stats.turns > maxTurns) {
            maxTurns = stats.turns;
        }
    }
    statistics[experimentName] = {avgTurns: (sumTurns / runs), maxTurns: maxTurns}
})

Object.keys(statistics).forEach(function (exp) {
    var stats = statistics[exp]
    console.log("Experiment: " + exp + " avgTurns: " + stats.avgTurns + ", maxTurns: " + stats.maxTurns)
})
