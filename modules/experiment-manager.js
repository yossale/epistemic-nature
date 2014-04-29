/**
 * Created by yossale on 4/6/14.
 */

var _ = require('underscore')
var UniverseInstance = require('./universe-instance');
var Actions = require('./actions')

var costs = {}
costs[Actions.CONSUME] = 1;
costs[Actions.ASK] = 3;
costs[Actions.SEARCH] = 10;

var experiments = {

    'utopian experiment': {
        agent: {
            pBelieve: 1.0,
            pLie: 0.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        }
    },

    'dystopian experiment': {
        agent: {
            pBelieve: 0.0,
            pLie: 1.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        }
    },

    'dystopian experiment 2': {
        agent: {
            pBelieve: 0.0,
            pLie: 0.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        }
    },

    'Trust no one Experiment': {
        agent: {
            pBelieve: 1.0,
            pLie: 1.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        }
    },

    'real life': {
        agent: {
            pBelieve: 0.5,
            pLie: 0.5,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        }
    }
}

var statistics = {}
Object.keys(experiments).forEach(function (experimentName) {

    var expConfig = experiments[experimentName]

    var runs = 1000;
    var sumTurns = 0;
    var maxTurns = 0;

    for (index = 0; index < runs; index++) {

        var experiment = new UniverseInstance(expConfig);

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
