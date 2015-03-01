# Smart City - Citizen Engagement - Express Skeleton

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

### Data population

- POST /api/data/populate

### User resource

- GET /api/users
- POST /api/users
- GET /api/users/{id}
- PUT /api/users/{id}
- DELETE /api/users/{id}

## Etudiants

Clélia Panchaud et Florent plomb
