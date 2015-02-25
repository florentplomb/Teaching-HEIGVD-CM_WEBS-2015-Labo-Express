var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose');
  

module.exports = function (app) {
    app.use('/api/test', router);
};

function next(err){
    return res.json(err).end();
};

router.route('/')
	.get(function(req, res, next) {
		Comment.find().remove(function(err) {
                populateComment(res);
		});

	});



	/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


