// Modele Tag : défini le shchéma d'un tag pérsistante dans la base de données 
// Params //
// desc : description du tag

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TagSchema = new Schema({
  desc: String
});



mongoose.model('Tag', TagSchema);



