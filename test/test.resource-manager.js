/**
 * Created by yossale on 4/2/14.
 */

var _ = require('underscore');
var should = require('should');
var Actions = require('../modules/actions');
var ResourceManager = require('../modules/resource-manager');


describe('Resource manager test suit', function () {

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
        should.not.exist(rm.getResourceByProbability())
        rm.updateResources();
        Object.keys(rm.resources).length.should.equal(3);
        _.values(rm.resources).forEach(function (resource) {
            resource.capacity.should.be.above(99);
        })

    })

    it('Test assignment', function () {
        //Should search
        var config = { resource: {
            initialResourceCapacity: 100,
            consumptionRate: 10
        }}
        var rm = new ResourceManager(3, config)
        rm.updateResources();

        var varifiedRandomness = false;
        var firstResource = rm.getResourceByProbability(1.0);
        for (i = 0; i < 100; i++) {
            var curResource = rm.getResourceByProbability(1.0);
            if (curResource !== firstResource) {
                varifiedRandomness = true;
                break;
            }
        }

        varifiedRandomness.should.be.true;

    })

    it('Test re-creation of resources', function () {

        var config = { resource: {
            initialResourceCapacity: 20,
            consumptionRate: 10
        }}

        var rm = new ResourceManager(3, config)
        rm.updateResources();

        var resource = rm.getResourceByProbability(1.0);

        resource.consume();
        resource.consume();

        rm.updateResources();

        _.values(rm.resources).forEach(function (resource) {
            resource.capacity.should.be.above(10);
        })
    })

})
