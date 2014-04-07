/**
 * Created by yossale on 3/29/14.
 */

var should = require('chai').should();
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

			agent.act().should.equal("search")

			//Should consume 3 times, the 3rd time he'll find out it's empty
			agent.act().should.equal("consume")

			agent.act().should.equal("consume")

			agent.act().should.equal("consume")

			agent.pSearch = 0.0
			agent.act().should.equal("ask")
	})

	it('Test life span', function() {
		var agent = new EpistemicAgent(experimentManager, "testId", 10, 0.1, 0.5, 0.0, costs, 1.0)

		agent.hasSurvived().should.be.true
		agent.act()
		agent.hasSurvived().should.be.false
	})

})

