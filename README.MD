
# Smart City - Citizen Engagement - API

## Students

Clélia Panchaud & Florent plomb 
COMEM MIT41 & MM41
 
Haute Ecole d'Ingénierie et de Gestion du Canton de Vaud (HEIG-VD)
Route de Cheseaux 1,
Avenue des Sports 20
1400 Yverdon-les-Bains
Téléphone 024 557 63 30 | www.heig-vd.ch 


## API deployed on Heroku

Documentation : http://pacific-sands-7883.herokuapp.com/

Example route 

- http://afternoon-woodland-9450.herokuapp.com/api/users

- http://afternoon-woodland-9450.herokuapp.com/api/issue

- http://afternoon-woodland-9450.herokuapp.com/api/issues?dateEnd=01/01/2014

## Our Choice

NODE.JS !

We chose to use Node Js for following reason :

We have little experience in this language, and we want to find new opportunities.

JavaScript has traditionally only run in the web browser, but recently there has been considerable interest in bringing it to the server side as well, thanks to the Node js.

Tools and Node community is in expansion.

It allows to set up a development environment for API-RESTFULL very quickly.

The package management system NPM is fast, robust, and consistent. It does a great job at specifying and installing project dependencies.

Using Node.js allows you to use the same language on the client, on the server, and in the database. You can keep your data in its native JSON format from browser to disk.

If you're using an object database like Mongo, then you can extend JavaScript to the persistence layer as well.

To finish :  Node is trendy at the moment. It is great to impress these friends in a discussion.
 

## Introduction

The implementation is done with:

- [Express](http://expressjs.com/)
- [Node.js](http://nodejs.org/)
- [Mongoose](mongoosejs.com)
- [MongoDB](http://www.mongodb.org/)

## Requirements

- Nodejs 0.10+
- NPM 2.4+
- Bower 1.3+
- Mongo 2.6+
- Grunt 0.4+

## Implementation

Base your implementation on the info from [iFlux blog's post](http://www.iflux.io/use-case/2015/02/03/citizen-engagement.html).

## Configure

Update the file `config/config.js` to change the MongoDB database name. Also update the `package.json` at the root level to give
a correct name to your project. Same for `bower.json`.

## Install / Deploy / Run

Just run the following command. Be sure MongoDB is running before running the command.

```bash
# Run only once the command to install the app dependencies
$> npm install

# Start the server app
$> npm start

# OR

# During development, use the following command
$> grunt
```

## Test

The appliation is runing on `http://localhost:3000`. You should be able to access the following:

## How to use API

#### Populate DB 

- POST /api/data/populateuser
- POST /api/data/populateissuetype
- POST /api/data/populatetag
- POST /api/data/populateactiontype

#### Create an issue 

- POST /api/issues

Example data:
{    
        "status" : "created",
        "desc": "A new issue ",            
        "userId":"54e999763f45823810976be7",
        "issueTypeId": ["54e74440a03a29e41dd7ac40","54e74440a03a29e41dd7ac41"],
        "tag" :["54e730af7d49c0002325c66e","54e730af7d49c0002325c673"],    
          "geoData":{"lg":"41.123213",
            		 "lat": "7.623453323"}
}

#### Create an action an issue 

- POST /api/issues/{issueID}/action

Example data :

{                  
        "actionTypeId": "54ec59f2c41943dc1460b221",            
        "userId":"54e999763f45823810976be7",
  		"desc"	:"Hello l'equipe voiçi le commentaire à ajouter à l'issue3"
     
}

 Now you can use all the route ( API REFRENCE ) in this documentation: Documentation : http://pacific-sands-7883.herokuapp.com/





