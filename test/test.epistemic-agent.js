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

    it('Test basic actions', function () {

        var experimentManager = {
            searchResource: function () {
                return new Resource("test-resource", 20, 10)
            },
            getRandomAgent: function () {
                return new EpistemicAgent(experimentManager, 100, 0.1, 0.5, 1.0, costs, 1.0)
            }
        }

        //Should search
        var agent = new EpistemicAgent(experimentManager, "test", 100, 0.1, 0.5, 1.0, costs, 1.0);

        agent.act().should.containEql('search');

        //Should consume 3 times, the 3rd time he'll find out it's empty
        agent.act().should.containEql('consume');
        agent.act().should.containEql('consume');
        agent.act().should.containEql('consume');

        agent.pSearch = 0.0;
        agent.act().should.containEql("ask");
    })

    it('Test life span', function () {

        var experimentManager = {
            searchResource: function () {
                return null;
            },
            getRandomAgent: function () {
                return new EpistemicAgent(experimentManager, 100, 0.1, 0.5, 1.0, costs, 1.0);
            }
        }

        var startEnergy = costs[Actions.SEARCH] + 1;
        var agent = new EpistemicAgent(experimentManager, "testId", startEnergy, 0.1, 0.5, 0.0, costs, 1.0);

        agent.hasSurvived().should.be.true;
        agent.act().should.containEql('ask');
        agent.act().should.have.length(0);
        agent.act().should.have.length(0);
        agent.act().should.have.length(0);
        agent.act().should.have.length(0);
        agent.act().should.have.length(0);
        agent.hasSurvived().should.be.false;
    })

    it('test getting a resource from other user', function () {

        var givingAgent = new EpistemicAgent(experimentManager, "test2", 100, 1.0, 0.0, 1.0, costs, 1.0)

        givingAgent.addResource(new Resource("test-resource", 20, 10))

        var experimentManager = {
            searchResource: function () {
                return new Resource("test-resource", 20, 10);
            },
            getRandomAgent: function () {
                return givingAgent;
            }
        }

        var curAgent = new EpistemicAgent(experimentManager, "test", 100, 1.0, 0.5, 0.0, costs, 1.0);
        //experimentManager, agentId, energy, pBelieve, pLie, pSearch, costs, credibilityBias

        curAgent.act();
        Object.keys(curAgent.currentResources).should.have.length(1);
        curAgent.act();
        curAgent.energy.should.be.above(95);

        //Add the giving agent a resource, and then run the curAgent and see if he gets a resource
    })

    it('test saving interaction history - lying agent', function () {

        var costs = {}
        costs[Actions.CONSUME] = 1;
        costs[Actions.ASK] = 5;
        //He'll never ask
        costs[Actions.SEARCH] = 10000000;

        var experimentManager = {
            searchResource: function () {
                return new Resource("test-resource", 20, 10);
            },
            getRandomAgent: function () {
                return lyingAgent;
            },
            getMockedResource: function () {
                return new Resource(-1, -1, 10);
            }
        }

        //pLie = 1.0
        var lyingAgent = new EpistemicAgent(experimentManager, "test2", 100, 1.0, 1.0, 1.0, costs, 1.0)

        lyingAgent.addResource(new Resource("test-resource", 20, 10))

        var curAgent = new EpistemicAgent(experimentManager, "test", 100, 1.0, 0.5, 0.0, costs, 1.0);
        //experimentManager, agentId, energy, pBelieve, pLie, pSearch, costs, credibilityBias

        curAgent.act().should.containEql('ask');
        Object.keys(curAgent.currentResources).should.have.length(1);
        var interaction = curAgent.pastInteractions[lyingAgent];
        should.exist(interaction);
        interaction.pos.should.equal(0);
        interaction.neg.should.equal(1);

        curAgent.getProbabilityBelievingAgent(lyingAgent).should.be.below(0.6);
        curAgent.getProbabilityBelievingAgent(lyingAgent).should.be.above(0.4);

    })

    it('test saving interaction history - truthful agent', function () {

        var costs = {}
        costs[Actions.CONSUME] = 1;
        costs[Actions.ASK] = 5;
        //He'll never ask
        costs[Actions.SEARCH] = 10000000;

        var truthfulAgent = null;

        var experimentManager = {
            searchResource: function () {
                return new Resource(1, 20, 10);
            },
            getRandomAgent: function () {
                return truthfulAgent;
            },
            getMockedResource: function () {
                return new Resource(-1, -1, 10);
            }
        }

        truthfulAgent = new EpistemicAgent(experimentManager, "test2", 100, 1.0, 0.0, 1.0, costs, 1.0)

        truthfulAgent.addResource(new Resource(2, 20, 10))

        var curAgent = new EpistemicAgent(experimentManager, "test", 100, 1.0, 0.5, 0.0, costs, 1.0);
        //experimentManager, agentId, energy, pBelieve, pLie, pSearch, costs, credibilityBias

        curAgent.act().should.containEql('ask');
        Object.keys(curAgent.currentResources).should.have.length(1);
        var interaction = curAgent.pastInteractions[truthfulAgent];
        should.exist(interaction);
        interaction.pos.should.equal(1);
        interaction.neg.should.equal(0);

        curAgent.getProbabilityBelievingAgent(truthfulAgent).should.be.above(0.9);
    })

    it.only('test computing reputation from history', function () {

        var experimentManager = {};

        var pBelieve = 1.0;

        var curAgent = new EpistemicAgent(experimentManager, "test", 100, pBelieve, 0.5, 0.0, costs, 1.0);

        curAgent.computeBelieveProbabilityFromHistory(undefined).should.equal(pBelieve);

        var history = {pos: 0, neg: 0};

        curAgent.computeBelieveProbabilityFromHistory(history).should.equal(pBelieve);

        var history = {pos: 1, neg: 0};

        curAgent.computeBelieveProbabilityFromHistory(history).should.equal(pBelieve);

        var history = {pos: 0, neg: 1};

        curAgent.computeBelieveProbabilityFromHistory(history).should.equal(0.5);

        var history = {pos: 1, neg: 1};

        curAgent.computeBelieveProbabilityFromHistory(history).should.be.above(0.65);
        curAgent.computeBelieveProbabilityFromHistory(history).should.be.below(0.67);

    })


})

