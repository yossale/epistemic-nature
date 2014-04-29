/**
 * Created by yossale on 4/2/14.
 */

var should = require('should');
var Resource = require('../modules/resource')

describe('Resource test suit', function () {

	it('Test basic actions', function () {
		//Should search
		var resource = new Resource("test-resource",20,10);
		resource.capacity.should.equal(20);
		resource.consumptionRate.should.equal(10);
		resource.isDepleted().should.be.false;
		resource.consume().should.equal(10);
		resource.capacity.should.equal(10);
		resource.consume().should.equal(10);
		should.not.exist(resource.consume())
		resource.isDepleted().should.be.true;
	})



})
