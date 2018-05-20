var async = require('async');
async.waterfall([ function(callback){ console.log("1"); callback(null, 'one', 'two'); }, function(arg1, arg2, callback){ console.log(arg1 + " " + arg2); console.log("2"); callback(null, 'three'); }, function(arg1, callback){ console.log(arg1); console.log("3"); callback(null, 'done'); } ], function (err, result) { console.log(result); console.log("end"); });
