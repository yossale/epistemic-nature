/**
 * Created by yossale on 4/6/14.
 */

var _ = require('underscore')
var map = {'a':1, b:2, c:3}

var arr = _.values(map)
console.log(arr)
console.log(Math.min(arr))
console.log(Math.min.apply(Math,[1,2,3]))


