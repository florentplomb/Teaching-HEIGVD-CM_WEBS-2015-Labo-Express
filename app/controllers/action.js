var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Action = mongoose.model('Action');

module.exports = function (app) {
  app.use('/api/action', router);
};

function convertMongoAction(action) {
	//return user.toObject({ transform: true })
	return {
		id: action.id,
		type: action.type,
		date: action.date,
                desc: action.desc,
                empl: action.empl
	}
}

router.route('/')


	.post(function (req, res, next) {
		var action = new Action({
			type: req.body.type,
			date: req.body.date,
                        desc: req.body.desc,
                        empl: req.body.empl
                        
		});

		action.save(function(err, actionSaved) {
			res.status(201).json(convertMongoAction(actionSaved));
		});
	});

router.route('/:id')
	.get(function(req, res, next) {
		Action.findById(req.params.id, function(err, action) {
			res.json(convertMongoAction(action));
		});
	})

	.put(function(req, res, next) {
		Action.findById(req.params.id, function(err, action) {
			action.type = req.body.type;
			action.date = req.body.date;
                        action.desc = req.body.desc;
                        action.empl = req.body.empl;


			action.save(function(err, actionSaved) {
				res.json(convertMongoAction(actionSaved));
			});
		});
	})

	.delete(function(req, res, next) {
		Action.findByIdAndRemove(req.params.id, function(err) {
			res.status(204).end();
		});
	});

