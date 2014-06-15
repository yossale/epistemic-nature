/**
 * Created by yossale on 3/29/14.
 */

var Actions = require('./actions')
var _ = require('underscore')

function EpistemicAgent(experimentManager, agentId, energy, pBelieve, pLie, pSearch, costs, credibilityBias) {
    this.experimentManager = experimentManager
    this.agentId = agentId;
    this.energy = energy;
    this.pBelieve = pBelieve;
    this.pLie = pLie;
    this.pSearch = pSearch;
    this.credibilityBias = credibilityBias;
    this.costsTable = costs;
    this.currentResources = {};
    this.minimalEnergy = Math.min.apply(Math, _.values(costs));
    this.pastInteractions = {};
}

EpistemicAgent.prototype.act = function () {

    var self = this;

    var actions = [];

    //Cost of living
    self.energy -= 1;

    if (self.hasResources()) {
        self.consumeResource();
        actions.push(Actions.CONSUME);
    }

    var rand = Math.random();

    var askingSucceeded = true;

    if (rand > self.pSearch) {
        if (self.askSomeone()) {
            askingSucceeded = true;
            actions.push(Actions.ASK);
        }
    }

    if (rand < self.pSearch || !askingSucceeded) {
        if (self.searchResource()) {
            actions.push(Actions.SEARCH);
        }
    }

    return actions;
}

EpistemicAgent.prototype.addResource = function (resource) {
    this.currentResources[resource.resourceId] = resource;
}

EpistemicAgent.prototype.consumeResource = function () {
    var self = this;

    var successful = false;
    var resource = _.values(self.currentResources)[0];

    var gainedEnergy = resource.consume();
    if (gainedEnergy) {
        self.energy += gainedEnergy - self.costsTable[Actions.CONSUME];
        successful = true;
    } else {
        successful = false;
        delete self.currentResources[resource.resourceId];
    }

    report(self.agentId, "CONSUME", self.getEnergy(), successful);
}

EpistemicAgent.prototype.searchResource = function () {
    var self = this

    if (self.energy < self.costsTable[Actions.SEARCH]) {
        return false;
    }

    var resource = self.experimentManager.searchResource();

    var successfulSearch = false
    if (resource) {
        self.addResource(resource);
        successfulSearch = true;
    }

    self.energy -= self.costsTable[Actions.SEARCH];
    report(self.agentId, "SEARCH", self.getEnergy(), successfulSearch);

    return true;

}

EpistemicAgent.prototype.askSomeone = function () {
    var self = this;

    if (self.energy < self.costsTable[Actions.ASK]) {
        return false;
    }

    var successful = false;

    var otherAgent = self.experimentManager.getRandomAgent();
    if (otherAgent) {
        var newResource = otherAgent.wouldYouShareResource();
        if (newResource) {
            var weightedPBelieve = self.getProbabilityBelievingAgent(otherAgent);
            if (Math.random() > (1.0 - weightedPBelieve)) {
                self.addResource(newResource);
                successful = true;
                //Mocked resources have negative ids
                self.updateInteractionsHistory(otherAgent, newResource.resourceId >= 0)
            } else {
                //Don't believe him
            }
        }
    } else {
        return false;
    }

    self.energy -= self.costsTable[Actions.ASK];
    report(self.agentId, "ASK", self.getEnergy(), successful);
    return true;
}

EpistemicAgent.prototype.hasResources = function () {
    return Object.keys(this.currentResources).length > 0;
}

EpistemicAgent.prototype.wouldYouShareResource = function () {
    var self = this;

    if (Math.random() < self.pLie) {
        return self.experimentManager.getMockedResource();
    } else {
        return self.hasResources() ? _.values(self.currentResources)[0] : null;
    }
}

EpistemicAgent.prototype.updateInteractionsHistory = function (otherAgent, toldTruth) {

    var self = this;

    var history = self.pastInteractions[otherAgent];

    if (!history) {
        history = { pos: 0, neg: 0}
        self.pastInteractions[otherAgent] = history;
    }

    if (toldTruth) {
        history.pos++;
    } else {
        history.neg++;
    }
}

EpistemicAgent.prototype.getProbabilityBelievingAgent = function (otherAgent) {
    var self = this;

    var userHistory = self.pastInteractions[otherAgent];

    return self.computeBelieveProbabilityFromHistory(userHistory);
}

EpistemicAgent.prototype.computeBelieveProbabilityFromHistory = function (history) {

    var self = this;

    if (!history) {
        history = {pos: 0, neg: 0}
    }

    var total = history.pos + history.neg;

    var prob = (self.pBelieve + history.pos) / (total + 1);

    return prob;
}

EpistemicAgent.prototype.getCredibilityBias = function () {
    return this.credibilityBias;
}

EpistemicAgent.prototype.getEnergy = function () {
    return this.energy;
}

EpistemicAgent.prototype.getAgentId = function () {
    return this.agentId;
}

EpistemicAgent.prototype.hasSurvived = function () {
    return (this.getEnergy() >= this.minimalEnergy);
}

function report(agentId, action, energyLevel, successful) {
//    console.log([agentId, action, energyLevel, successful].join(","))
}

module.exports = EpistemicAgent



