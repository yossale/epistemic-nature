/**
 * Created by yossale on 4/1/14.
 */

var Resource = require('./resource')

function ResourceManager(requiredResources, config) {

	this.config = config;
	this.requiredResources = requiredResources;
	this.resources = {}
	this.unassignedResources = {}
	this.resourceIdCounter = 0

}

ResourceManager.prototype.updateResources = function() {

	var self = this;
	var currentResources = Object.keys(self.resources).length

	Object.keys(self.resources).forEach(function(resourceId){
		if (self.resources[resourceId].isDepleted()) {
			delete(self.resources[resourceId])
			delete(self.unassignedResources[resourceId])
		}
	})

	if (currentResources < self.requiredResources) {
		var neededResources = self.requiredResources - currentResources
		for (i=0; i<neededResources; i++) {
			var resourceId = self.resourceIdCounter++;
			var resource = new Resource(resourceId);
			self.resources[resourceId] = resource;
			self.unassignedResources[resourceId] = 0;
		}
	}
}

ResourceManager.prototype.getUnassignedResource = function(pResource) {

	var self = this;
	if (Object.keys(self.unassignedResources).length === 0) {
		return null
	}

	if (Math.random() < pResource) {
		while (Object.keys(self.unassignedResources).length > 0) {

			var resourceId = Object.keys(self.unassignedResources)[0]
			var count = ++self.unassignedResources[resourceId]
			var resource = self.resources[resourceId]

			if (count >= 3) {
				delete(self.unassignedResources[resourceId])
			}

			if (resource.isDepleted()) {
				//Just to make sure we don't provide a stale resource
				delete(self.unassignedResources[resourceId])
			} else {
				return resource
			}
		}
	}
}

module.exports = ResourceManager;
