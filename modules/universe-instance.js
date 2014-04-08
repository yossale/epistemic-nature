/**
 * Created by yossale on 3/29/14.
 */

var CONSTS = require('./consts')
var ResourceManager = require('./resource-manager')
var EpistemicAgent = require('./epistemic-agent')

function UniverseInstance(config) {

    this.config = config;
	this.agentIdCounter = 0;
    this.community = []

    this.maxSupportedCommunitySize = config.maxSupportedCommunitySize;
    this.initialCommunitySize = config.initialCommunitySize;

	var requiredResources = this.maxSupportedCommunitySize / CONSTS.RESOURCE_SIZE
    this.resourceManager = new ResourceManager(requiredResources, config)
}

UniverseInstance.prototype.getCommunitySize = function() {
	return this.community.length;
}

function distributeResources(community, resourceManager) {

	var size = community.length
    for (i = 0; i < size; i++) {
        var agent = community[i];
        var resource = resourceManager.getUnassignedResource(1.0);

        if (resource) {
//            console.log("Assigned resource to agent: " + agent.getAgentId())
            agent.addResource(resource)
        } else {
            return
        }
    }
}

UniverseInstance.prototype.run = function() {

	var self = this;
    var turnsCounter = 0;

	self.addAgents(self.initialCommunitySize);
    self.resourceManager.updateResources();
	distributeResources(self.community, self.resourceManager);

    var statistics = { };
    var maxSize = 0;

	while(self.community.length > 0 && turnsCounter < 1000 ) {

		turnsCounter++;

        if (self.getCommunitySize() > maxSize) {
            maxSize = self.getCommunitySize()
        }

//		console.log("Turn: " + turnsCounter + " ,size: " + self.getCommunitySize())
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

    statistics.turns = turnsCounter;
    statistics.maxSize = maxSize;

    return statistics;
}

UniverseInstance.prototype.addAgents = function(numUsers) {
	var self = this;
	for (i=0; i<numUsers; i++) {
		self.community.push(self.createAgent())
	}
}

UniverseInstance.prototype.createAgent = function() {
	var agentId = this.agentIdCounter++;
    return new EpistemicAgent(this, agentId, this.config.initialUserEnergy, this.config.agent.pBelieve, this.config.agent.pLie, this.config.agent.pSearch, this.config.costs, this.config.agent.credibilityBias);
}


UniverseInstance.prototype.searchResource = function() {
	var communitySize = this.getCommunitySize();
//	var pFindingResource = 1.0 / (communitySize * 2.0);
    var pFindingResource = 1.0 / 1000.0;
	return this.resourceManager.getUnassignedResource(pFindingResource);
}

UniverseInstance.prototype.getRandomAgent = function() {
	var randomAgent = Math.floor(Math.random() * this.getCommunitySize());
	return this.community[randomAgent];
}

module.exports = UniverseInstance

