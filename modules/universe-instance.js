/**
 * Created by yossale on 3/29/14.
 */

var _ = require('underscore');
var CONSTS = require('./consts');
var ResourceManager = require('./resource-manager');
var EpistemicAgent = require('./epistemic-agent');
var defaultExperimentValues = require('./experiment_configurations/default-configuration');
var std = 0.05;

function UniverseInstance(config) {

    this.config = _.extend(defaultExperimentValues, config)
    this.agentIdCounter = 0;
    this.community = [];

    this.maxSupportedCommunitySize = this.config.maxSupportedCommunitySize;
    this.initialCommunitySize = this.config.initialCommunitySize;

    var requiredResources = this.maxSupportedCommunitySize / CONSTS.RESOURCE_SIZE;
    this.resourceManager = new ResourceManager(requiredResources, this.config);
    this.probabilityOfFindingNewSource = this.config.probabilityOfFindingNewSource;
}

UniverseInstance.prototype.getCommunitySize = function () {
    return this.community.length;
}

function distributeResources(community, resourceManager) {

    var size = community.length
    for (i = 0; i < size; i++) {
        var agent = community[i];
        var resource = resourceManager.getResourceByProbability(1.0);

        if (resource) {
//            console.log("Assigned resource to agent: " + agent.getAgentId())
            agent.addResource(resource)
        } else {
            return
        }
    }
}

var gaussianRand = function (mean, std) {

    var u1 = Math.random();
    var u2 = Math.random();
    var normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    normal = (normal * std) + mean;

    if (normal > 1.0) {
        normal = 1.0;
    }
    if (normal < 0.0) {
        normal = 0.0;
    }

    return normal;
}


UniverseInstance.prototype.runSingleExperiment = function () {

//    console.log("Running universe: " + JSON.stringify(this.config));

    var self = this;
    var turnsCounter = 0;

    self.addAgents(self.initialCommunitySize);
    self.resourceManager.updateResources();
    distributeResources(self.community, self.resourceManager);

    var maxSize = 0;
    var communitySizeSum = 0;
    var statistics = [];

    while (self.community.length > 0 && turnsCounter < 1000) {

        turnsCounter++;

        communitySizeSum += self.getCommunitySize();
        if (self.getCommunitySize() > maxSize) {
            maxSize = self.getCommunitySize()
        }

        self.resourceManager.updateResources();
        var energySum = 0;
        self.community.forEach(function (agent) {
            if (!agent.hasSurvived()) {
                var index = self.community.indexOf(agent)
                self.community.splice(index, 1)
            } else {
                agent.act();
                energySum += agent.getEnergy();
            }
        })

        var avgEnergy = energySum / self.community.length;
//        console.log("Turn: " + turnsCounter + ", Size: " + self.getCommunitySize() + ", avgEnergyLevel: " + avgEnergy);

        if (avgEnergy > self.config.initialAgentEnergy && self.config.createNewAgentsWhenSurplus) {
            var newUsers = (avgEnergy - self.config.initialAgentEnergy) / 10
            self.addAgents(newUsers)
        }
    }

    var stats = {};

    stats.turns = turnsCounter;
    stats.avgCommunitySize = communitySizeSum / turnsCounter;
    stats.maxSize = maxSize;

    return stats;
}

UniverseInstance.prototype.addAgents = function (numUsers) {
    var self = this;
    for (i = 0; i < numUsers; i++) {
        self.community.push(self.createAgent())
    }
}

UniverseInstance.prototype.createAgent = function () {
    var agentId = this.agentIdCounter++;
    var pBelieve = gaussianRand(this.config.agent.pBelieve, std);
    var pLie = gaussianRand(this.config.agent.pLie, std);
    return new EpistemicAgent(this, agentId, this.config.initialAgentEnergy, pBelieve, pLie, this.config.agent.pSearch, this.config.costs, this.config.agent.credibilityBias);
}


UniverseInstance.prototype.searchResource = function () {
    var communitySize = this.getCommunitySize();
    var pFindingResource = this.probabilityOfFindingNewSource(communitySize);

    return this.resourceManager.getResourceByProbability(pFindingResource);
}

UniverseInstance.prototype.getMockedResource = function () {
    return this.resourceManager.getMockedResource();
}


UniverseInstance.prototype.getRandomAgent = function (askingAgent) {

    if (this.getCommunitySize() === 1) {
        return null;
    }

    var randomAgent = Math.floor(Math.random() * this.getCommunitySize());

    while (randomAgent === askingAgent) {
        randomAgent = Math.floor(Math.random() * this.getCommunitySize());
    }
    return this.community[randomAgent];
}

function runExperiments(config, times) {

    times = times || 1;
    var statistics = [];

    for (index = 0; index < times; index++) {
        var universe = new UniverseInstance(config);
        statistics.push(universe.runSingleExperiment());
    }

    return statistics
}

module.exports = runExperiments;

