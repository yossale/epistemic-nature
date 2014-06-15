/**
 * Created by yossale on 4/6/14.
 */

var _ = require('underscore');
var fs = require('fs');
var experimentRunner = require('../universe-instance');
var Actions = require('../actions');

var runsPerExperiment = 100;

var runExperiment = function (expConfig, expName) {

    console.log("Running experiment: " + expName);

    var runs = runsPerExperiment;

    var sumTurns = 0;
    var maxTurns = 0;
    var sumAvgCommunitySize = 0;

    var results = experimentRunner(expConfig, runsPerExperiment);

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

var probabilityOfFindingAResourceFunctions = {

    '1.0': function (communitySize) {
        return 1.0;
    },
    '0.7': function (communitySize) {
        return 0.7;
    },
    '0.5': function (communitySize) {
        return 0.5;
    },
    '0.3': function (communitySize) {
        return 0.3;
    },
    '0.1': function (communitySize) {
        return 0.1;
    },
    '0.01': function (communitySize) {
        return 0.01;
    },
    '0.001': function (communitySize) {
        return 0.001;
    }
}


var believe = parseFloat(process.argv[2]);

console.log("Running for believe value: " + believe);

var outputFileName = "./" + believe.toFixed(2) + "_results_per_" + runsPerExperiment + "_runs_" + new Date().toJSON() + ".ssv";

var streamOptions = {encoding: 'utf8'}
var wstream = fs.createWriteStream(outputFileName, streamOptions);

wstream.on('finish', function () {
    console.log('file has been written');
});

wstream.write(['pBelieve', 'pLie', 'pSearch', 'pFind', 'avgTurns', 'maxTurns', 'avgCommunitySize'].join(" ") + "\n");
var experimentsCounter = 0;

for (lie = 0; lie <= 14; lie++) {
    for (searchCost = 1; searchCost <= 20; searchCost++) {
        Object.keys(probabilityOfFindingAResourceFunctions).forEach(function (prob) {

            experimentsCounter++;

            var costs = {}
            costs[Actions.CONSUME] = 1;
            costs[Actions.ASK] = 3;
            costs[Actions.SEARCH] = costs[Actions.ASK] * searchCost;

            var conf = {
                agent: {
                    pBelieve: believe,
                    pLie: 0.15 + (0.05 * lie),
                    pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
                    credibilityBias: 1.0
                },
                costs: costs,
                probabilityOfFindingNewSource: probabilityOfFindingAResourceFunctions[prob],
                createNewAgentsWhenSurplus: false
            }

            var experimentName = [conf.agent.pBelieve.toFixed(3), conf.agent.pLie.toFixed(3), conf.agent.pSearch.toFixed(3), prob].join(" ")
            var expRes = runExperiment(conf, experimentName);
            var message = [experimentName, expRes.avgTurns, expRes.maxTurns, expRes.avgCommunitySize].join(" ");
            wstream.write(message + "\n");
        })
    }
}


//wstream.end('Finished writing to stream\n');

console.log("Ran " + experimentsCounter + " experiments, results are at: " + outputFileName);