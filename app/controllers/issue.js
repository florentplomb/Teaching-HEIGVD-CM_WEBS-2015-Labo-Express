// Issue controller : Ce controller gère les informations entre la base de données et les issues

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




module.exports = function (app) {
    app.use('/api/issues', router);
};
function next(err){
    return res.json(err).end();
};

// Retourne les infortmations d'une issue perssistante 

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
// Retourne les infortmations d'une action perssistante 

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

// Retourne les issues persistantes en fonction de différent parmatètre:
// Le type , le status et la date de l'issue   


.get(function (req, res, next) {

    var type,dateStart,dateEnd,date,status = true

     var issuetype = req.query.type
     var date1 = new Date(req.query.date1)
     var date2 = new Date(req.query.date2)
     var issuestatus = req.query.status



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
                            return next(err); 
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

// Enregistre une issue selon les informations d'entrée


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
                    return next(err); 
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

// Retourne une issues peristante spécifique 

.get(function (req, res, next) {


    Issue.findById(req.params.id)
    .populate('tag user issueType comment ')
    .exec(function (err, issue) {
        if (err)
        {
                            return next(err); 
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

 // Mise à jour  d'une issues peristante spécifique 

        .put(function (req, res, next) {
            Issue.findById(req.params.id, function (err, issue) {

                if (err) {
                    return next(err) 
                }
                ;

                if (issue === null) {
                    return res.json({
                        code: 204,
                        message: "Issue is empty"
                    }).end();
                }
                issue.tag = req.body.tag;
                issue.status = req.body.status;
                issue.desc = req.body.desc;
                issue.geoData = req.body.geoData                
                issue.save(function (err, issueSaved) {
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
})
//Supprime une issue specifique

.delete(function (req, res) {
    Issue.findByIdAndRemove(req.params.id, function (err , next) {
        if (err)
        {
                    return next(err); 
                }
                res.status(204).end();
            });
});


router.route('/:id/action')

// Retourne la liste des actions effectuees sur une issue specifique

// .get(function (req, res, next) {

// //     Action.find()
// //     .populate('issue actionType')
// //     .where( 'issue' , req.params.id)
// //     .exec(function (err, issues) {
// //         if (err)
// //         {
// //                             return next(err); 
// //                         if (issues === null) {
// //                             return res.json({
// //                                 code: 204,
// //                                 message: "Issues is Empty"
// //                             }).end();
// //                         }
// //                         res.json(_.map(issues, function (action) {

// //                             return convertMongoAction(action);
// //                         }));
// //                     })


// // })
//  });

// Cére une nouvelle action persitante sur une issues :


.post(function (req, res, next) {
    var action = new Action({
        user: req.body.userId,
        desc: req.body.desc,
        actionType: req.body.actionTypeId,
        issue:req.params.id});         

    action.save(function (err, actionSaved,next) {
        if (err)
        {
                    return next(err); 
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

// Determine l'action à effectue sur une issue:
// -Ajouter une commentaire à une action
// -Changer le status d'une issue
// Params : -Action : l'action à effecuter
//          -issueId : l'issueId sur laquelle l'action à lieu

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