var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Comment = mongoose.model('Comment');

module.exports = function (app) {
  app.use('/api/comment', router);
};

function convertMongoComment(comment) {
	//return user.toObject({ transform: true })
	return {
		id: comment.id,
		author: comment.author,
		date: comment.date,
                content: comment.content
	}
}

router.route('/')


	.post(function (req, res, next) {
		var comment = new Comment({
			author: req.body.author,
			date: req.body.date,
                        content: req.body.content
                        
		});

		comment.save(function(err, commentSaved) {
			res.status(201).json(convertMongoComment(commentSaved));
		});
	});

router.route('/:id')
	.get(function(req, res, next) {
		Comment.findById(req.params.id, function(err, comment) {
			res.json(convertMongoComment(comment));
		});
	})

	.put(function(req, res, next) {
		Comment.findById(req.params.id, function(err, comment) {
			comment.author = req.body.author;
			comment.date = req.body.date;
                        comment.content = req.body.content;


			comment.save(function(err, commentSaved) {
				res.json(convertMongoComment(commentSaved));
			});
		});
	})

	.delete(function(req, res, next) {
		Comment.findByIdAndRemove(req.params.id, function(err) {
			res.status(204).end();
		});
	});
