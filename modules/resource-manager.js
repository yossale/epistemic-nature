/**
 * Created by yossale on 4/1/14.
 */

var Resource = require('./resource')

function ResourceManager(requiredResources, config) {
    this.config = config;
    this.requiredResources = requiredResources;
    this.resources = {};
    this.resourceIdCounter = 0;
    this.mockedResourceIdCounter = 0;

}

ResourceManager.prototype.updateResources = function () {

    var self = this;

    Object.keys(self.resources).forEach(function (resourceId) {
        if (self.resources[resourceId].isDepleted()) {
            delete(self.resources[resourceId])
        }
    })

    var currentResources = Object.keys(self.resources).length

    if (currentResources < self.requiredResources) {
        var neededResources = self.requiredResources - currentResources;
        for (i = 0; i < neededResources; i++) {
            var resourceId = ++self.resourceIdCounter;
            var initSize = self.config.resource.initialResourceCapacity;
            var consumptionRate = self.config.resource.consumptionRate;
            var resource = new Resource(resourceId, initSize, consumptionRate);
            self.resources[resourceId] = resource;
        }
    }
}

ResourceManager.prototype.getResourceByProbability = function (pResource) {

    var self = this;

    if (Math.random() < pResource) {

        var curResources = Object.keys(self.resources);
        var randomResourceId = Math.floor(Math.random() * curResources.length);

        return self.resources[curResources[randomResourceId]];
    }
}

ResourceManager.prototype.getMockedResource = function () {
    return new Resource(--this.mockedResourceIdCounter, -1, 1);
}

module.exports = ResourceManager;
