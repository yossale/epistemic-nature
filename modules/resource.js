/**
 * Created by yossale on 3/29/14.
 */

function Resource(resourceId, initialCapacity, consumptionRate){
	this.resourceId = resourceId;
	this.capacity = initialCapacity;
	this.consumptionRate = consumptionRate;
}

Resource.prototype.consume = function() {
	if (this.isDepleted()) {
		return -1
	} else {
		this.capacity -= this.consumptionRate
		return this.consumptionRate
	}
}

Resource.prototype.isDepleted = function() {
	return this.consumptionRate > this.capacity
}

Resource.prototype.getId = function() {
	return this.resourceId
}

module.exports = Resource
