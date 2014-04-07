/**
 * Created by yossale on 3/29/14.
 */

var CONSTS = require('./consts')
var ResourceManager = require('./resource-manager')
var EpistemicAgent = require('./epistemic-agent')

function UniverseInstance(maxSupportedCommunitySize, initialCommunitySize, pBelieve, pLie, pSearch, costs, credibilityBias) {

	this.agentIdCounter = 0;
	this.maxSupportedCommunitySize = maxSupportedCommunitySize;
	this.initialCommunitySize = initialCommunitySize;
	this.pBelieve = pBelieve;
	this.pLie = pLie;
	this.pSearch = pSearch;
	this.costs = costs;
	this.credibilityBias = credibilityBias;
	this.community = []

	var requiredResources = this.maxSupportedCommunitySize / CONSTS.RESOURCE_SIZE
	this.resourceManager = new ResourceManager(requiredResources)
}

UniverseInstance.prototype.getCommunitySize = function() {
	return this.community.length;
}

function distributeResources(community, resourceManager) {

	var size = community.length
	community.forEach(function(agent){
		if (Math.random() < (1 / size)) {
			var resource = resourceManager.getUnassignedResource(1.0);
			if (resource) {
				agent.addResource()
			}
		}

	})

}

UniverseInstance.prototype.run = function() {

	var self = this;
	var turnsCounter = 0

	self.addAgents(self.initialCommunitySize);
	distributeResources(self.community, self.resourceManager);

	while(self.community.length > 0 && turnsCounter < 1000 ) {

		turnsCounter++;

		console.log("Turn: " + turnsCounter + " ,size: " + self.getCommunitySize())
		self.resourceManager.updateResources();
		var energySum = 0;
		self.community.forEach(function(agent){
			if (!agent.hasSurvived()) {
				var index = self.community.indexOf(agent)
				self.community.splice(index,1)
			} else {
				agent.act();
				energySum += Math.max(agent.getEnergy(),0);
			}
		})

		var avgEnergy = energySum / self.community.length

		if (avgEnergy > 100) {
			var newUsers = (avgEnergy - 100) / 10
			self.addAgents(newUsers)
		}
	}
}

UniverseInstance.prototype.addAgents = function(numUsers) {
	var self = this;
	for (i=0; i<numUsers; i++) {
		self.community.push(self.createAgent())
	}
}

UniverseInstance.prototype.createAgent = function() {
	var agentId = this.agentIdCounter++;
	return new EpistemicAgent(this, agentId, 100, this.pBelieve, this.pLie, this.pSearch, this.costs, this.credibilityBias);
}


UniverseInstance.prototype.searchResource = function() {

	var communitySize = this.getCommunitySize();
	var pFindingResource = 1.0 / (communitySize * 10.0);
	return this.resourceManager.getUnassignedResource(pFindingResource);

}

UniverseInstance.prototype.getRandomAgent = function() {

	var randomAgent = Math.floor(Math.random() * this.getCommunitySize());
	return this.community[randomAgent];

}

module.exports = UniverseInstance

