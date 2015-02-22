var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue'),
        IssueType = mongoose.model('IssueType'),
        User = mongoose.model('User'),
        GeoData = mongoose.model('GeoData'),
        Tag = mongoose.model('Tag');


// Action = mongoose.model('Action'); Peut-Ãªtre besoins pour issuse/id/action ???

module.exports = function (app) {
    app.use('/api/issues', router);
};

function convertMongoIssue(issue) {
    //return user.toObject({ transform: true })
    return {
        tag: issue.tag,
        status: issue.status,
        desc: issue.desc,
        date: issue.date,
        user: issue.user,
        issueType: issue.issueType,
        geoData: issue.geoData,
        comment: issue.comment
    }
}

router.route('/')

        .get(function (req, res, next) {
            Issue.find()
                    .populate('tag user issueType comment ')
                    .exec(function (err, issues) {
                        if (err)
                            return next(err);
                        res.json(_.map(issues, function (issue) {

                            return convertMongoIssue(issue);
                        }));
                    });


        })

        .post(function (req, res, next) {
            var issue = new Issue({
                tag: req.body.tag,
                status: req.body.status,
                desc: req.body.desc,
                geoData: req.body.geoData,
                user: req.body.userId,
                issueType: req.body.issueTypeId,
                comment: req.body.commentId

            });


            issue.save(function (err, issuseSaved) {
                console.log(err);
                if (err)
                    return next(err);
                res.status(201).json(convertMongoIssue(issuseSaved));

            });
        });

router.route('/:id')

            .get(function (req, res, next) {
                
            Issue.findById(req.params.id) 
            
                    .populate('tag user issueType comment ')
                    .exec(function (err, issue) {
                        if (err)
                            return next(err);
                        res.json(convertMongoIssue(issue));
                    });

                })
            
         // Specific Issue update 
         // Utile de tester si une valeur n'est pas puté , on prend l'ancienne valeur?

        .put(function (req, res, next) {
            Issue.findById(req.params.id, function (err, issue) {

                issue.tag = req.body.tag;
                issue.status = req.body.status;
                issue.desc = req.body.desc;
                issue.geoData = req.body.geoData
                issue.user = req.body.userId;
                issue.issueType = req.body.issueTypeId;
                issue.comment = req.body.commentId;

                issue.save(function (err, issueSaved) {
                    res.json(convertMongoIssue(issueSaved));
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

            action.save(function (err, actionSaved) {
                res.status(201).json(convertMongoAction(actionSaved));
            });
        })

        .get(function (req, res, next) {
            Action.findById(req.params.id, function (err, action) {
                res.json(convertMongoAction(action));
            });
        });