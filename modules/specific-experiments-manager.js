/**
 * Created by yossale on 4/6/14.
 */

var _ = require('underscore')
var experimentRunner = require('./universe-instance');
var Actions = require('./actions')

var costs = {}
costs[Actions.CONSUME] = 1;
costs[Actions.ASK] = 3;
costs[Actions.SEARCH] = 15;

var probabilityOfFindingNewSource = function (communitySize) {
    return 0.1;
}

var createNewAgentsWhenSurplus = false;

var experiments = {

    'pBelieve = 0.0, pLie = 0.0': {
        agent: {
            pBelieve: 0.0,
            pLie: 0.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        },
        probabilityOfFindingNewSource: probabilityOfFindingNewSource,
        createNewAgentsWhenSurplus: createNewAgentsWhenSurplus
    },

    'pBelieve = 0.0, pLie = 1.0': {
        agent: {
            pBelieve: 0.0,
            pLie: 1.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        },
        probabilityOfFindingNewSource: probabilityOfFindingNewSource,
        createNewAgentsWhenSurplus: createNewAgentsWhenSurplus
    },

    'pBelieve = 1.0, pLie = 0.0': {
        agent: {
            pBelieve: 1.0,
            pLie: 0.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        },
        probabilityOfFindingNewSource: probabilityOfFindingNewSource,
        createNewAgentsWhenSurplus: createNewAgentsWhenSurplus
    },

    'pBelieve = 1.0, pLie = 1.0': {
        agent: {
            pBelieve: 1.0,
            pLie: 1.0,
            pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
            credibilityBias: 1.0
        },
        probabilityOfFindingNewSource: probabilityOfFindingNewSource,
        createNewAgentsWhenSurplus: createNewAgentsWhenSurplus
    }
}

var runExperiment = function (expConfig, expName) {

    console.log("Running experiment: " + expName);

    var runs = 10000;

    var sumTurns = 0;
    var maxTurns = 0;
    var sumAvgCommunitySize = 0;

    var results = experimentRunner(expConfig, runs);

    for (index = 0; index < results.length; index++) {

        var stats = results[index];
        sumTurns += stats.turns;
        if (stats.turns > maxTurns) {
            maxTurns = stats.turns;
        }
        sumAvgCommunitySize += stats.avgCommunitySize

    }
    return {avgTurns: (sumTurns / runs).toFixed(3), maxTurns: maxTurns, avgCommunitySize: (sumAvgCommunitySize / runs).toFixed(3)}
}


Object.keys(experiments).forEach(function (experimentName) {

        var expConfig = experiments[experimentName];

        var res = runExperiment(expConfig, experimentName);

        console.log(res)

    }
)

