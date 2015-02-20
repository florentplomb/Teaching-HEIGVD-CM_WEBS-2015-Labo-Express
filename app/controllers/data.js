var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
	User = mongoose.model('User'),
	IssueType = mongoose.model('IssueType');
        Comment = mongoose.model('Comment');


module.exports = function (app) {
  app.use('/api/data', router);
};

function random (low, high) {
    return Math.random() * (high - low) + low;
}

function randomInt (low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var firstnames = [ 'Alfred', 'Henri', 'Romain', 'Benoit', 'Alain', 'Alex'];
var lastnames = [ 'Dupont', 'Dutoit', 'Ducroc', 'Desportes', 'Terieur' ];

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


var start = 2000-01-01;
var end = 2015-01-01;
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

function generateRoles() {
	var roles = [[ 'citizen' ], [ 'staff' ], [ 'citizen', 'staff' ]];
	return roles[randomInt(0, 3)];
}

function generateTags() {
	var data = [];
	for (var i = 0; i < randomInt(1, 10); i++) {
		data.push(tags[randomInt(0, tags.length)]);
	}

	return _.uniq(data);
}

function populateIssueTypes(res) {
	// TODO: Implement the issue type generation

	var data = [];
	for (var i = 0; i < 10; i++) {
		data.push({
			// TODO: Implement the issuetype random generation
			name: shortnames[randomInt(0, shortnames.length)],
			desc: descriptionsAndComments[randomInt(0, descriptionsAndComments.length)]
		});
	}
	
	IssueType.create(data, function(err) {
		issueTypes = Array.prototype.slice.call(arguments, 1);
	
		res.status(200).end();
	});
}

function populateComment(res) {
	// TODO: Implement the issue type generation

	var data = [];
	for (var i = 0; i < 10; i++) {
		data.push({
			// TODO: Implement the issuetype random generation
			author: shortnames[randomInt(0, shortnames.length)],		
                        content: descriptionsAndComments[randomInt(0, descriptionsAndComments.length)],
                        date: randomDate(new Date(2000,01,01),new Date(2015,01,01))
                        
		});
                
	}
	
	Comment.create(data, function(err) {
		comment = Array.prototype.slice.call(arguments, 1);
	
		res.status(200).end();
	});
}

function populateTag(res) {
	var data = [];
	for (var i = 0; i < 15; i++) {
		data.push({
			 
			tag: generateTags(),
                        date: randomDate(new Date(2000,01,01),new Date(2015,01,01))
		});
	}
        }

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

	User.create(data, function(err) {
		// Each user is passed one by one as an argument list to the function.
		// Then, retrieve the list with this line.
		var usersCreated = Array.prototype.slice.call(arguments, 1);

		// Save users generated to later use in other data generation
		users = usersCreated;

		// Filter the citizen users for later generations
		citizen = _.where(usersCreated, function(user) {
			return _.contains(user.roles, 'citizen');
		});

		// Filter the staff users for later generations
		staff = _.where(usersCreated, function(user) {
			return _.contains(user.roles, 'staff');
		});

		// TODO: Call other generators as Mongoose is ASYNC and requires callbacks
		populateIssueTypes(res);
	});
};

router.route('/populate')
	.post(function(req, res, next) {
		IssueType.find().remove(function(err) {
			User.find().remove(function(err) {
				populateUsers(res);
			});
		});
	});


router.route('/populateissueType')
	.post(function(req, res, next) {
		IssueType.find().remove(function(err) {
                populateIssueTypes(res);
		});

                });



router.route('/populateComment')
	.post(function(req, res, next) {
		Comment.find().remove(function(err) {
                populateComment(res);
		});

	});

router.route('/populateTag')
	.post(function(req, res, next) {
		Tag.find().remove(function(err) {
                populateTag(res);
		});

	})

	