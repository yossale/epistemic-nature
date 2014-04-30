/**
 * Created by yossiittach on 4/29/14.
 */

var Actions = require('../actions')

var costs = {}
costs[Actions.CONSUME] = 1;
costs[Actions.ASK] = 3;
costs[Actions.SEARCH] = 10;

var defaultExperimentValues = {
    maxSupportedCommunitySize: 100,
    initialCommunitySize: 10,
    initialAgentEnergy: 100,
    costs: costs,
    createNewAgentsWhenSurplus: true,
    agent: {
        pBelieve: 0.5,
        pLie: 0.5,
        pSearch: (1 - costs[Actions.SEARCH] / (costs[Actions.SEARCH] + costs[Actions.ASK])),
        credibilityBias: 1.0
    },
    resource: {
        initialResourceCapacity: 100,
        consumptionRate: 10
    },
    probabilityOfFindingNewSource: function (communitySize) {
        return 1.0;
    }
}

module.exports = defaultExperimentValues