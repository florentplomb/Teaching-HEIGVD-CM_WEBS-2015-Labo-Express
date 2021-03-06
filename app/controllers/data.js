// Data controller : Genère des data aléatoires exploitables pour tester l'application

var
        _ = require('underscore'),
        express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        User = mongoose.model('User'),
        IssueType = mongoose.model('IssueType'),
        Comment = mongoose.model('Comment'),
        Tag = mongoose.model('Tag'),
        ActionType = mongoose.model('ActionType');

module.exports = function (app) {
    app.use('/api/data', router);
};

// fonction qui retourne des informations aléatoires

function random(low, high) {
    return Math.random() * (high - low) + low;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var firstnames = ['Alfred', 'Henri', 'Romain', 'Benoit', 'Alain', 'Alex'];
var lastnames = ['Dupont', 'Dutoit', 'Ducroc', 'Desportes', 'Terieur'];

var descriptionsAndComments = [
    'Morbi a odio cursus, finibus lorem ut, pellentesque elit.',
    'Nunc sollicitudin lorem at dolor placerat, eget ornare erat fringilla.',
    'Sed eget ipsum sit amet lacus dictum porttitor at facilisis velit.',
    'Integer at metus vitae erat porta pellentesque.',
    'Pellentesque iaculis ante vestibulum dolor finibus hendrerit.',
    'Mauris tempus orci quis orci lacinia cursus.',
    'Nam semper ligula quis nisl egestas, at pellentesque nunc tincidunt.',
    'Integer venenatis justo ac urna accumsan, eget hendrerit ligula eleifend.',
    'Ut sagittis ipsum sed nisl ultrices rutrum.',
    'Proin pretium lacus nec lectus congue, a finibus elit consequat.',
    'Sed id ligula semper, auctor metus et, mattis tortor.',
    'Aenean non massa quis urna pellentesque pellentesque in nec ex.',
    'Vestibulum non erat venenatis, finibus lorem ac, eleifend eros.',
    'Proin ac mi et turpis volutpat facilisis id eget est.',
    'Pellentesque mattis quam tincidunt sem rhoncus finibus.'
];

var tags = ['Proin', 'Orci', 'Egestas', 'Lobortis', 'Quam', 'Non', 'Posuere', 'Lorem', 'Etiam'];

var issueStates = [
    'created',
    'acknowledged',
    'assigned',
    'in_progress',
    'solved',
    'rejected'
];

var shortnames = [
    'broken streetlight',
    'dangerous crossroad',
    'graffiti',
    'broken road',
    'racist graffiti',
    'dangerous population'
];
var actionType = [
    'AddComment',
    'ChangeStatus'
];


var start = new Date(2000, 01, 01);
var end = new Date(2015, 01, 01);
var users = null;
var citizen = null;
var staff = null;
var issueTypes = null;
var issues = null;

// Yverdon square perimeter (Chamard -> Y-Parc approx)
var minLat = 46.766129;
var maxLat = 46.784234;
var minLng = 6.622009;
var maxLng = 6.651878;

// Génère les différents rôles qu'un user peu avoir

function generateRoles() {
    var roles = [['citizen'], ['staff'], ['citizen', 'staff']];
    return roles[randomInt(0, 3)];
}
// Génère des tags aléatoires

function generateTags() {
    var data = [];
    for (var i = 0; i < randomInt(1, 10); i++) {
        data.push(tags[randomInt(0, tags.length)]);
    }

    return _.uniq(data);
}
// Génère des action types aléatoires
function generateActionType() {
    var data = [];
    for (var i = 0; i < randomInt(1, 10); i++) {
        data.push(actionType[randomInt(0, actionType.length)]);
    }

    return _.uniq(data);
}
// Enregistrement des issues type

function populateIssueTypes(res) {
   

    var data = [];
    for (var i = 0; i < 10; i++) {
        data.push({
            // TODO: Implement the issuetype random generation
            name: shortnames[randomInt(0, shortnames.length)],
            desc: descriptionsAndComments[randomInt(0, descriptionsAndComments.length)]
        });
    }

    IssueType.create(data, function (err) {
        issueTypes = Array.prototype.slice.call(arguments, 1);

        res.status(200).end();
    });
}

// Enregistrement des action types

function populateActionType(res) {
    var data = [];
    
        data.push({
            code: 0,
            type: "Add Comment",
            desc: "Ajout d'un commentaire sur l'issue "
        });
            
        data.push({
            code: 1,
            type: "Change Status",
            desc: "Changement du status d'une issue "
        });
    
    ActionType.create(data, function (err) {
        actiontype = Array.prototype.slice.call(arguments, 1);

        res.status(200).end();

    });
}

// Enregistrement des tags

function populateTag(res) {
    var data = [];
    for (var i = 0; i < 15; i++) {
        data.push({
            desc: generateTags(),
            date: randomDate(start, end)
        });
    }
    Tag.create(data, function (err) {
        tag = Array.prototype.slice.call(arguments, 1);

        res.status(200).end();

    });
}


// Enregistrement des users

function populateUsers(res) {
    var data = [];
    for (var i = 0; i < 15; i++) {
        data.push({
            firstname: firstnames[randomInt(0, firstnames.length)],
            lastname: lastnames[randomInt(0, lastnames.length)],
            phone: '+' + randomInt(1000000, 10000000),
            roles: generateRoles()
        });
    }

    User.create(data, function (err) {
        // Each user is passed one by one as an argument list to the function.
        // Then, retrieve the list with this line.
        var usersCreated = Array.prototype.slice.call(arguments, 1);

        // Save users generated to later use in other data generation
        users = usersCreated;

        // Filter the citizen users for later generations
        citizen = _.where(usersCreated, function (user) {
            return _.contains(user.roles, 'citizen');
        });

        // Filter the staff users for later generations
        staff = _.where(usersCreated, function (user) {
            return _.contains(user.roles, 'staff');
        });


    });
}
;

router.route('/populateuser')
        .post(function (req, res, next) {
            IssueType.find().remove(function (err) {
                User.find().remove(function (err) {
                    populateUsers(res);
                });
            });
        });


router.route('/populateissuetype')
        .post(function (req, res, next) {
            IssueType.find().remove(function (err) {
                populateIssueTypes(res);
            });

        });



router.route('/populatetag')
        .post(function (req, res, next) {
            Tag.find().remove(function (err) {
                populateTag(res);
            });

        })
router.route('/populateactiontype')
        .post(function (req, res, next) {
            ActionType.find().remove(function (err) {
                populateActionType(res);
            });

        })

	