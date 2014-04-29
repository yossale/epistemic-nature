/**
 * Created by yossale on 3/29/14.
 */

var should = require('should');
var EpistemicAgent = require('../modules/epistemic-agent')
var Resource = require('../modules/resource')
var Actions = require('../modules/actions')

describe('Epistemic agent test suit', function () {

	var costs = {}
	costs[Actions.CONSUME] = 1;
	costs[Actions.ASK] = 5;
	costs[Actions.SEARCH] = 10;

	var experimentManager = {
		searchResource: function() {return new Resource("test-resource",20,10)},
		getRandomAgent: function() {new EpistemicAgent(experimentManager, 100, 0.1, 0.5, 1.0, costs, 1.0)}
	}

	it('Test basic actions', function () {
			//Should search
			var agent = new EpistemicAgent(experimentManager, "test", 100, 0.1, 0.5, 1.0, costs, 1.0)

        agent.act().should.containEql('search');

			//Should consume 3 times, the 3rd time he'll find out it's empty
        agent.act().should.containEql('consume');
        agent.act().should.containEql('consume');
        agent.act().should.containEql('consume');

			agent.pSearch = 0.0
        agent.act().should.containEql("ask")
	})

	it('Test life span', function() {

        var minimalEnergy = costs[Actions.CONSUME] + costs[Actions.ASK]
        var agent = new EpistemicAgent(experimentManager, "testId", minimalEnergy, 0.1, 0.5, 0.0, costs, 1.0)

		agent.hasSurvived().should.be.true
		agent.act()
        agent.act()
		agent.hasSurvived().should.be.false
	})

    it('test getting a resource from other user', function () {

        var givingAgent = new EpistemicAgent(experimentManager, "test2", 100, 1.0, 0.0, 1.0, costs, 1.0)

        givingAgent.addResource(new Resource("test-resource", 20, 10))

        var experimentManager = {
            searchResource: function () {
                return new Resource("test-resource", 20, 10)
            },
            getRandomAgent: function () {
                return givingAgent
            }
        }

        var curAgent = new EpistemicAgent(experimentManager, "test", 100, 1.0, 0.5, 0.0, costs, 1.0)
        //experimentManager, agentId, energy, pBelieve, pLie, pSearch, costs, credibilityBias

        curAgent.act()
        curAgent.currentResources.should.have.length(1)
        curAgent.act()
        curAgent.energy.should.be.above(95)

        //Add the giving agent a resource, and then run the curAgent and see if he gets a resource


    })

})

