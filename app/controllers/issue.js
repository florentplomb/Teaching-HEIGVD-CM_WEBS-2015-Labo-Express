var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue');
        IssueType = mongoose.model('IssueType');
        User = mongoose.model('User');
// Action = mongoose.model('Action'); Peut-être besoins pour issuse/id/action ???

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
        lg: issue.lg,
        lat: issue.lat,
        user: issue.user,
        issueType: issue.issueType,
        geoData: issue.geoData,
        comment: issue.comment
    }
}

router.route('/')
//  .get(function (req, res, next) {
//            Issue.find(function (err, issues) {
//                if (err)
//                    return next(err);
//                res.json(_.map(issues, function (issue) {
//                    return convertMongoIssue(issue);
//                }));
//            });
//        })


        .get(function (req, res, next) {
            Issue.find()
                    .populate('user issueType comment')
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
                date: req.body.date,
                lg: req.body.lg,
                lat: req.body.lat,
                user: req.body.userId,
                issueType: req.body.issueTypeId,
                comment: req.body.commentId

            });


            issue.save(function (err, issuseSaved) {
                    console.log(err);
                  if(err) return next(err);
                    res.status(201).json(convertMongoIssue(issuseSaved));
              
            });
        });

router.route('/:id')
        .get(function (req, res, next) {
            Issue.findById(req.params.id, function (err, issue) {
                res.json(convertMongoIssue(issue));
            });
        })

        .put(function (req, res, next) {
            Issue.findById(req.params.id, function (err, user) {

                issue.tag = req.body.tag;
                issue.status = req.body.status;
                issue.desc = req.body.desc;
                issue.date = req.body.date;
                issue.lg = req.body.lg;
                issue.lat = req.body.lat;
                issue.user = req.body.userId;
                issue.issueType = req.body.issueTypeId;
                issue.comment = req.body.commentId;

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

            action.save(function (err, actionSaved) {
                res.status(201).json(convertMongoAction(actionSaved));
            });
        })

        .get(function (req, res, next) {
            Action.findById(req.params.id, function (err, action) {
                res.json(convertMongoAction(action));
            });
        });