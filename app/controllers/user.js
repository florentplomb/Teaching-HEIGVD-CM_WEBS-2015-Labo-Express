// Users controller : Ce controller gère les informations entre la base de données et les users

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
    app.use('/api/users', router);
};

function convertMongoUser(user) {
    //return user.toObject({ transform: true })
    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        roles: user.roles
    }
}

function convertMongoIssue(issue) {
    //return user.toObject({ transform: true })
    console.log(issue.user);
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


router.route('/')

// Retourne tous les users pérsistants

        .get(function (req, res, next) {
            User.find(function (err, users) {
                if (err)
                    return next(err);
                res.json(_.map(users, function (user) {
                    return convertMongoUser(user);
                }));
            });
        })
// Sauvgarde un nouveau user

        .post(function (req, res, next) {
            var user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                roles: req.body.roles
            });

            user.save(function (err, userSaved) {
                res.status(201).json(convertMongoUser(userSaved));
            });
        });

router.route('/:id')

// Retourne les informations d'un user pérsistant spécifique 

        .get(function (req, res, next) {

            User.findById(req.params.id, function (err, user) {
                if (err)
                   { return next(err); }
                res.json(convertMongoUser(user));
            });
        })
// Mises à jours des informations d'un user pérsistant spécifique 

        .put(function (req, res, next) {
            User.findById(req.params.id, function (err, user) {
                if (err)
                  {  return next(err); }
                user.firstname = req.body.firstname;
                user.lastname = req.body.lastname;
                user.phone = req.body.phone;
                user.roles = req.body.roles;

                user.save(function (err, userSaved) {
                    res.json(convertMongoUser(userSaved));
                });
            });
        })
// Supprime les informations d'un user pérsistant spécifique 

        .delete(function (req, res, next) {
            User.findByIdAndRemove(req.params.id, function (err) {
                    res.status(204).end();
            });
        });
// Retourne toutes les issues crée par un utilisateur spécifique 

router.route('/:id/issues')
         .get(function (req, res, next) {

        Issue
          .find()
          .populate('user')
          .where( 'user', req.params.id )
          .exec(function(err, issues) {
            // On aura ici toutes les issues, de tous les users se prénommant Henri
            res.json(_.map(issues, function(issue) { return convertMongoIssue(issue); }));
          });
      });
   

 
        
        

   
