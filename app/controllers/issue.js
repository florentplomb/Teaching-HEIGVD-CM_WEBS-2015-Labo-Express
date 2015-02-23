var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        Issue = mongoose.model('Issue'),
        IssueType = mongoose.model('IssueType'),
        User = mongoose.model('User'),
        GeoData = mongoose.model('GeoData'),
        Tag = mongoose.model('Tag'),
        Action = mongoose.model("Action"),
        ActionType = mongoose.model("ActionType");


// Action = mongoose.model('Action'); Peut-être besoins pour issuse/id/action ???

module.exports = function (app) {
    app.use('/api/issues', router);
};

function convertMongoIssue(issue) {
    //return user.toObject({ transform: true })
    return {
        id: issue.id,
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

function convertMongoAction(action) {
    //return user.toObject({ transform: true })
    return {
        id: action.id,
        actionType: action.actionType,
        desc: action.desc,
        user: action.user

    };
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
        // Utile de tester si une valeur n'est pas put� , on prend l'ancienne valeur?

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
                user: req.body.userId,
                desc: req.body.desc,
                actionType: req.body.actionTypeId

            });
            
            ActionType.findById(action.actionType, function (err, actionType) {
                 if (err) {
                res.status(204).end();
            }
            else {
               
              var issueId = req.params.id ;
                    actionOnIssue(actionType,issueId);
            }
                
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
function actionOnIssue(actionType,issueId){
    
    switch(actionType.code) {
    case 0:
     
        console.log("code 0" + issueId);
        break;
    case 1:
        onsole.log("code 1" + issueId);
        break;

}
    
    
    
}