// Modele IssueType : défini le shchéma d'un issutype pérsistant dans la base de données
// Params //
// name : description courte
// desc : la description longue de l'issue type

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueTypeSchema = new Schema({
  name: String,
  desc: String

});

mongoose.model('IssueType', IssueTypeSchema);

