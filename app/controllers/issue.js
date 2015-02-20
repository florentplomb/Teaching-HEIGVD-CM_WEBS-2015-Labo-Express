var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue');
        // Action = mongoose.model('Action'); Peut-être besoins pour issuse/id/action ???

module.exports = function (app) {
    app.use('/api/issues', router);
};

function convertmongoIssue(issue) {
    //return user.toObject({ transform: true })
    return {
                tag:issue.tag,
                status:issue.status,
                desc: issue.desc,
                date: issue.date,
                userId:issue.user,
                issueTypeId:issue.issueTypeId,
                geoDataId:issue.geoDataId,
                commentId:issue.commentId
    }
}

router.route('/')
        .get(function (req, res, next) {
            Issue.find(function (err, issue) {
                if (err)
                    return next(err);
                res.json(_.map(issue, function (issue) {
                    return convertMongoIssue(issue);
                }));
            });
        })

        .post(function (req, res, next) {
            var issue = new Issue({
                tag: req.body.tag,
                status: req.body.status,
                desc: req.body.desc,
                date: req.body.date,
                user:req.body.userId, // je lui donne un user en entier?
                issueTypeId:req.body.issueTypeId,
                geoDataId:req.body.geoDataId,
                commentId:req.body.commentId
                
            });
            

            issue.save(function (err, issuseSaved) {
                res.status(201).json(convertmongoIssue(issuseSaved));
            });
        });

router.route('/:id')
        .get(function (req, res, next) {
            Issue.findById(req.params.id, function (err, issue) {
                res.json(convertmongoIssue(issue));
            });
        })

        .put(function (req, res, next) {
            Issue.findById(req.params.id, function (err, user) {             
               
                issue.tag = req.body.tag;
                issue.status = req.body.status;
                issue.desc = req.body.desc;
                issue.date = req.body.date;
                issue.userId = req.body.userId;
                issue.issueTypeId = req.body.issueTypeId;
                issue.geoDataId = req.body.geoDataId;
                issue.commentId = req.body.commentId;

                user.save(function (err, issueSaved) {
                    res.json(convertmongoIssue(issueSaved));
                });
            });
        })

        .delete(function (req, res, next) {
            Issue.findByIdAndRemove(req.params.id, function (err) {
                res.status(204).end();
            });
        });
        
router.route('/:id/action')

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
	})
        
        .get(function(req, res, next) {
		Action.findById(req.params.id, function(err, action) {
			res.json(convertMongoAction(action));
		});
	});