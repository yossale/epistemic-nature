/**
 * Created by yossale on 3/29/14.
 */
//"test": "node_modules/.bin/mocha -w"

var should = require('should');
var EpistemicAgent = require('../modules/epistemic-agent')
var Resource = require('../modules/resource')
var Actions = require('../modules/actions')

describe('Epistemic agent test suit', function () {


	var costs = {}
	costs[Actions.CONSUME] = 1;
	costs[Actions.ASK] = 5;
	costs[Actions.SEARCH] = 10;


	describe.only('Test basic actions', function () {

		it('Test searching for resources', function () {

			var experimentManager = {
				searchResource: function() {return new Resource("test-resource",20,10)},
				getRandomAgent: function() {new EpistemicAgent(experimentManager, 100, 0.1, 0.5, 1.0, costs, 1.0)}
			}

			//Should search
			var agent = new EpistemicAgent(experimentManager, 100, 0.1, 0.5, 1.0, costs, 1.0)

			agent.act().should.equal("search")

			//Should consume 3 times, the 3rd time he'll find out it's empty
			agent.act().should.equal("consume")

			agent.act().should.equal("consume")

			agent.act().should.equal("consume")


			agent.pSearch = 0.0
			agent.act().should.equal("ask")

		})

	})
})

