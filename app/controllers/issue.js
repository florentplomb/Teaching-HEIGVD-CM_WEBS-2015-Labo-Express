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
ActionType = mongoose.model("ActionType"),
Comment = mongoose.model("Comment");


// Action = mongoose.model('Action'); Peut-Ãªtre besoins pour issuse/id/action ???

module.exports = function (app) {
    app.use('/api/issues', router);
};
function next(err){
    return res.json(err).end();
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
        comment: issue.comment,
        action:issue.action
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

    var type,dateStart,dateEnd,date,status = true

     var issuetype = req.query.type
     var date1 = new Date(req.query.date1)
     var date2 = new Date(req.query.date2)
     var issuestatus = req.query.status

    //Model.find({"date": {'$gte': new Date('3/1/2014'), '$lt': new Date('3/16/2014')}}, callback);



    if (req.query.date1 && req.query.date2) {

        date = {"date": {'$gte': date1, '$lt': date2}}
        
    }

    else if (req.query.date1){
       
        dateStart = {'date': {'$gte': date1 }}
    }
    else if (req.query.date2)
    {
        dateEnd = {'date': {'$lt': date2 }}
    }

     if (req.query.type) {
     type = {'issueType': issuetype}      
     }

if (req.query.status) {
     status = {'status': issuestatus}      
     }

Issue.find()

  .and(dateStart)
  .and(dateEnd)
  .and(date)
  .and(type)
  .and(status)


        .exec(function (err, issues) {
            if (err)
            {
                            return next(err); // je dois la crÃ©e ma fonction next right?
                        }
                        if (issues === null) {
                            return res.json({
                                code: 204,
                                message: "Issues is Empty"
                            }).end();
                        }
                        res.json(_.map(issues, function (issue) {

                            return convertMongoIssue(issue);
                        }));
    })

       

})




.post(function (req, res, next) {



    var issue = new Issue({
        tag: req.body.tag,
        status: req.body.status,
        desc: req.body.desc,
        geoData: req.body.geoData,
        user: req.body.userId,
        issueType: req.body.issueTypeId


    });


    issue.save(function (err, issueSaved) {
        if (err)
        {
                    return next(err); // je dois la crÃ©e ma fonction next right?
                }
                if (issueSaved === null) {
                    return res.json({
                        code: 204,
                        message: "Issue not save"
                    }).end();
                }
                res.status(201).json(convertMongoIssue(issueSaved));

            });
});

router.route('/:id')

.get(function (req, res, next) {


    Issue.findById(req.params.id)
    .populate('tag user issueType comment ')
    .exec(function (err, issue) {
        if (err)
        {
                            return next(err); // je dois la crÃ©e ma fonction next right?
                        }
                        if (issue === null) {
                            return res.json({
                                code: 204,
                                message: "Issue is empty"
                            }).end();
                        }

                        res.json(convertMongoIssue(issue));
                    });

})

        // Specific Issue update 


        .put(function (req, res, next) {
            Issue.findById(req.params.id, function (err, issue) {

                if (err) {
                    return next(err) // je dois la crÃ©e ma fonction next right?
                }
                ;

                if (issue === null) {
                    return res.json({
                        code: 204,
                        message: "Issue is empty"
                    }).end();
                }
                // On ne laisse pas la possibilité de changer l'auteur , le type et le commentaire d'une issue.
                issue.tag = req.body.tag;
                issue.status = req.body.status;
                issue.desc = req.body.desc;
                issue.geoData = req.body.geoData                
                issue.save(function (err, issueSaved) {
                    if (err)
                    {
                        return next(err); // je dois la crÃ©e ma fonction next right?
                    }
                    if (issueSaved === null) {
                        return res.json({
                            code: 204,
                            message: "Issue not save"
                        }).end();
                    }
                    res.json(convertMongoIssue(issueSaved));
                });
            });
})

.delete(function (req, res) {
    Issue.findByIdAndRemove(req.params.id, function (err , next) {
        if (err)
        {
                    return next(err); // je dois la crÃ©e ma fonction next right?
                }
                res.status(204).end();
            });
});

router.route('/:id/action')

.get(function (req, res, next) {

    Action.find()
    .populate('issue actionType')
    .where( 'issue' , req.params.id)
    .exec(function (err, issues) {
        if (err)
        {
                            return next(err); // je dois la crÃ©e ma fonction next right?
                        }
                        if (issues === null) {
                            return res.json({
                                code: 204,
                                message: "Issues is Empty"
                            }).end();
                        }
                        res.json(_.map(issues, function (action) {

                            return convertMongoAction(action);
                        }));
                    });


})

.post(function (req, res, next) {
    var action = new Action({
        user: req.body.userId,
        desc: req.body.desc,
        actionType: req.body.actionTypeId,
        issue:req.params.id});         

    action.save(function (err, actionSaved,next) {
        if (err)
        {
                    return next(err); // je dois la crÃ©e ma fonction next right?
                }
                if (actionSaved === null) {
                    return res.json({
                        code: 204,
                        message: "action not save"
                    }).end();
                }

                actionOnIssue(actionSaved, req.params.id, res);

            });

})


function actionOnIssue(action, issueId, res) {

    ActionType.findById(action.actionType, function (err, actionType, next) {


        if (err)
        {
            return next(err); 
        }
        if (actionType === null) {
            return res.json({
                code: 204,
                message: "Action Type is empty"
            }).end();
        }

        switch (actionType.code) {
            case 0: // if code 0 , it's a action to add comment

            var comment = new Comment({
                user: action.user,
                content: action.desc

            });
            comment.save(function (err, commentSaved ,next) {

                if (err)
                {
                        return next(err); // je dois la crÃ©e ma fonction next right?
                    }
                    if (commentSaved === null) {
                        return res.json({
                            code: 204,
                            message: "Comment not save"
                        }).end();
                    }


                    Issue.findById(issueId, function (err, issue,next) {

                        if (err) {
                            return next(err) // je dois la crÃ©e ma fonction next right?
                        };                       
                        if (issue === null) {
                            return res.json({
                                code: 204,
                                message: "Issue is empty"
                            }).end();
                        }

                        issue.comment.push(commentSaved.id);
                        issue.action.push(action.id)


                        issue.save(function (err, issueSaved,next) {

                            if (err)
                            {
                                return next(err); // je dois la crÃ©e ma fonction next right?
                            }
                            if (issueSaved === null) {
                                return res.json({
                                    code: 204,
                                    message: "Issue not save"
                                }).end();
                            }

                            res.json(convertMongoIssue(issueSaved));

                        });
                    });
});
break;
case 1 :

Issue.findById(issueId, function (err, issue,next) {
 if (err) {
    return next(err) 
};                       
if (issue === null) {
    return res.json({
        code: 204,
        message: "Issue is empty"
    }).end();
}

issue.status = action.desc;
issue.action.push(action.id)

issue.save(function (err, issueSaved, next) {

    if (err)
    {
        return next(err); 
    }
    if (issueSaved === null) {
        return res.json({
            code: 204,
            message: "Issue not save"
        }).end();
    }

    res.json(convertMongoIssue(issueSaved));

});

});



}

}
)};