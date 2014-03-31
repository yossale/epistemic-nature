/**
 * Created by yossale on 3/29/14.
 */

var Actions = require('./actions')

function EpistemicAgent(experimentManager, energy, pBelieve, pLie, pSearch, costs, credibilityBias) {
	this.experimentManager = experimentManager
	this.energy = energy;
	this.pBelieve = pBelieve;
	this.pLie = pLie;
	this.pSearch = pSearch;
	this.credibilityBias = credibilityBias;
	this.costsTable = costs;
	this.currentResources = []
}

EpistemicAgent.prototype.act = function () {

	var self = this;

	if (self.hasResources()) {
		self.consumeResource();
		return Actions.CONSUME
	} else {
		if (Math.random() < self.pSearch) {
			self.searchResource();
			return Actions.SEARCH
		} else {
			self.askSomeone();
			return Actions.ASK
		}
	}
}

EpistemicAgent.prototype.consumeResource = function () {
	var self = this;

	var resource = self.currentResources[0]

	var gainedEnergy = resource.consume()
	if (gainedEnergy) {
		self.energy += gainedEnergy - self.costsTable[Actions.CONSUME]
	} else {
		self.currentResources.splice(0,1)
	}
}

EpistemicAgent.prototype.searchResource = function () {
	var self = this

	self.energy -= self.costsTable[Actions.SEARCH]

	var resource = self.experimentManager.searchResource();
	if (resource) {
		self.currentResources.push(resource)
	}
}

EpistemicAgent.prototype.askSomeone = function () {
	var self = this

	self.energy -= self.costsTable[Actions.ASK]

	var otherAgent = self.experimentManager.getRandomAgent();
	if (otherAgent) {
		var newResource = otherAgent.wouldYouShareResource()
		if (newResource) {
			var weightedPBelieve = otherAgent.getCredibilityBias() * Math.random();
			if (Math.random() > (1 - weightedPBelieve)) {
				self.currentResources.push(newResource)
			} else {
				//Don't believe him
			}
		}
	}
}

EpistemicAgent.prototype.hasResources = function () {
	return this.currentResources.length > 0;
}

EpistemicAgent.prototype.wouldYouShareResource = function () {
	var self = this;

	if (Math.random() < self.pLie) {
		return null
	} else {
		return self.hasResources() ? self.currentResources[0] : null
	}
}

EpistemicAgent.prototype.getCredibilityBias = function () {
	return this.credibilityBias;
}

EpistemicAgent.prototype.getEnergy = function () {
	return this.energy;
}

module.exports = EpistemicAgent



