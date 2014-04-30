/**
 * Created by yossale on 4/6/14.
 */

var _ = require('underscore')
var UniverseInstance = require('./universe-instance');
var Actions = require('./actions')

var costs = {}
costs[Actions.CONSUME] = 1;
costs[Actions.ASK] = 3;
costs[Actions.SEARCH] = 15;

var probabilityOfFindingNewSource = function (communitySize) {
    return 0.1;
}

var runExperiment = function (expConfig) {

    var runs = 1000;

    var sumTurns = 0;
    var maxTurns = 0;
    var sumAvgCommunitySize = 0;

    for (index = 0; index < runs; index++) {

        var experiment = new UniverseInstance(expConfig);

//        console.log("Running experiment: " + experimentName + " take: " + index);
        var stats = experiment.run();
        sumTurns += stats.turns;
        if (stats.turns > maxTurns) {
            maxTurns = stats.turns;
        }
        sumAvgCommunitySize += stats.avgCommunitySize

    }
    statistics[experimentName] = {avgTurns: (sumTurns / runs), maxTurns: maxTurns, avgCommunitySize: (sumAvgCommunitySize / runs)}

}

var createNewAgentsWhenSurplus = false;

var experiments = {

    'utopian experiment': {
        agent: {
            pBelieve: 1.0,
            pLie: 0.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        },
        probabilityOfFindingNewSource: probabilityOfFindingNewSource,
        createNewAgentsWhenSurplus: createNewAgentsWhenSurplus
    },

    'dystopian experiment': {
        agent: {
            pBelieve: 0.0,
            pLie: 1.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        },
        probabilityOfFindingNewSource: probabilityOfFindingNewSource,
        createNewAgentsWhenSurplus: createNewAgentsWhenSurplus
    }

//    'dystopian experiment 2': {
//        agent: {
//            pBelieve: 0.0,
//            pLie: 0.0,
//            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
//            credibilityBias: 1.0
//        }
//    },
//
//    'Trust no one Experiment': {
//        agent: {
//            pBelieve: 1.0,
//            pLie: 1.0,
//            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
//            credibilityBias: 1.0
//        }
//    },
//
//    'real life': {
//        agent: {
//            pBelieve: 0.5,
//            pLie: 0.5,
//            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
//            credibilityBias: 1.0
//        }
//    }
}

var statistics = {}

var probabilityOfFindingAResourceFunctions = {

    'fixed_1.0': function (communitySize) {
        return 1.0;
    },
    'fixed_0.7': function (communitySize) {
        return 0.7;
    },
    'fixed_0.5': function (communitySize) {
        return 0.5;
    },
    'fixed_0.3': function (communitySize) {
        return 0.3;
    },
    'fixed_0.1': function (communitySize) {
        return 0.1;
    },
    'fixed_0.01': function (communitySize) {
        return 0.01;
    },
    'fixed_0.001': function (communitySize) {
        return 0.001;
    },
    'variable_10*communitySize': function (communitySize) {
        return (1 / (communitySize * 10));
    },
    'variable_communitySize^2': function (communitySize) {
        return (1 / (Math.pow(communitySize, 2)));
    }
}

Object.keys(probabilityOfFindingAResourceFunctions).forEach(function (prob) {
    for (believe = 0; believe <= 10; believe++) {
        for (lie = 0; lie <= 10; lie++) {
            for (searchCost = 1; searchCost <= 20; searchCost++) {

                var costs = {}
                costs[Actions.CONSUME] = 1;
                costs[Actions.ASK] = 3;
                costs[Actions.SEARCH] = costs[Actions.ASK] * searchCost;

                var a = {
                    agent: {
                        pBelieve: 0.1 * believe,
                        pLie: 0.1 * lie,
                        pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
                        credibilityBias: 1.0
                    },
                    costs: costs,
                    probabilityOfFindingNewSource: probabilityOfFindingAResourceFunctions[prob],
                    createNewAgentsWhenSurplus: false
                }
            }
        }
    }
})


Object.keys(experiments).forEach(function (experimentName) {

        var expConfig = experiments[experimentName]

        var runs = 1000;

        var sumTurns = 0;
        var maxTurns = 0;
        var sumAvgCommunitySize = 0;

        for (index = 0; index < runs; index++) {

            var experiment = new UniverseInstance(expConfig);

//        console.log("Running experiment: " + experimentName + " take: " + index);
            var stats = experiment.run();
            sumTurns += stats.turns;
            if (stats.turns > maxTurns) {
                maxTurns = stats.turns;
            }
            sumAvgCommunitySize += stats.avgCommunitySize

        }
        statistics[experimentName] = {avgTurns: (sumTurns / runs), maxTurns: maxTurns, avgCommunitySize: (sumAvgCommunitySize / runs)}
    }
)

Object.keys(statistics).forEach(function (exp) {
    var stats = statistics[exp]
    console.log("Experiment: " + exp + " avgTurns: " + stats.avgTurns + ", maxTurns: "
        + stats.maxTurns + ", avgCommunitySize: " + stats.avgCommunitySize)
})
