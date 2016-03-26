var express = require('express');
var router = express.Router();

var async = require('async');

/*GET Existing Users current history*/
router.get('/userstats', isLoggedIn, function(req, res) {
    var user = req.user;
    async.waterfalll([
        function (done) {
            async.forEach(user.pools, function(pool, callback) {
                Pool.findById(pool, function(err, poolObj) {
                    
                });
            })
        }
    ])
});

module.exports = router;
