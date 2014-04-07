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
	allLiesExperiment: {
		maxSupportedCommunitySize: 1000,
		initialCommunitySize: 10,
		pBelieve: 0.0,
		pLie: 1.0,
		pSearch: 0.5,
		credibilityBias: 1.0,
		costs: costs
	},

	utopiaExperiment: {
		maxSupportedCommunitySize: 1000,
		initialCommunitySize: 10,
		pBelieve: 1.0,
		pLie: 0.0,
		pSearch: 0.5,
		credibilityBias: 1.0,
		costs: costs
	}
}

Object.keys(experiments).forEach(function(experimentName){

	var exp = experiments[experimentName]
	var experiment = new UniverseInstance(exp.maxSupportedCommunitySize,
		exp.initialCommunitySize,
		exp.pBelieve,
		exp.pLie,
		exp.pSearch,
		exp.costs,
		exp.credibilityBias);

	console.log("Running experiment: " + experimentName)
	experiment.run()

})
