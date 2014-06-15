var _ = require('underscore');


var gaussianRand = function (mean, std) {

    var u1 = Math.random();
    var u2 = Math.random();
    var normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    normal = (normal * std) + mean;

    console.log(normal);
}

var mean = 0.15;
var std = 0.05;

_.times(100, function (n) {
    gaussianRand(mean, std)
});
