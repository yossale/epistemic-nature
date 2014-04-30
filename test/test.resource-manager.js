/**
 * Created by yossale on 4/2/14.
 */

var should = require('should');
var Actions = require('../modules/actions')
var ResourceManager = require('../modules/resource-manager')

describe('Epistemic agent test suit', function () {

    var costs = {}
    costs[Actions.CONSUME] = 1;
    costs[Actions.ASK] = 5;
    costs[Actions.SEARCH] = 10;

    it('Test init', function () {
        //Should search

        var config = { resource: {
            initialResourceCapacity: 100,
            consumptionRate: 10
        }}

        var rm = new ResourceManager(3, config)

        Object.keys(rm.resources).length.should.equal(0);
        Object.keys(rm.unassignedResources).length.should.equal(0);
        should.not.exist(rm.getResourceByProbability())
        rm.updateResources();
        Object.keys(rm.resources).length.should.equal(3);
        Object.keys(rm.unassignedResources).length.should.equal(3);

    })

    it('Test assignment', function () {
        //Should search
        var config = { resources: {
            initialSize: 100,
            consumptionRate: 10
        }}
        var rm = new ResourceManager(3, config)
        rm.updateResources();

        var firstResource = rm.getResourceByProbability(1.0)
        rm.getResourceByProbability(1.0).should.equal(firstResource)
        rm.getResourceByProbability(1.0).should.equal(firstResource)
        rm.getResourceByProbability(1.0).should.not.equal(firstResource)

        Object.keys(rm.unassignedResources).length.should.equal(2);
        rm.updateResources();
        Object.keys(rm.unassignedResources).length.should.equal(2);
    })

    it.only('Test re-creation of resources', function () {

        var config = { resources: {
            initialSize: 20,
            consumptionRate: 10
        }}

        var rm = new ResourceManager(3, config)
        rm.updateResources();

        var resource = rm.getResourceByProbability(1.0);

        resource.consume();
        resource.consume();

        //check that we don't get a consumed resource
        rm.getResourceByProbability(1.0).should.not.equal(resource);

        //Check that it was removed
        Object.keys(rm.unassignedResources).length.should.equal(2);

        rm.updateResources();
        Object.keys(rm.unassignedResources).length.should.equal(3);
    })

})
