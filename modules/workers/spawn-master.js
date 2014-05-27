/**
 * Created by yossale on 4/6/14.
 */

var fs = require('fs');
var process = require('child_process');

for (believe = 0; believe <= 10; believe++) {

    var ls = process.spawn('node', ['runExperimentForBelieveValue.js', 0.1 * believe]);

    ls.stdout.on('data', function (data) {
        console.log('>>' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr - ' + data);
    });

    ls.on('close', function (code) {
        console.log('child process ' + believe + ' exited with code ' + code);
    });

}
