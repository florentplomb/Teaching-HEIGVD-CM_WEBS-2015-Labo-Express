
// Modele Comment : défini le shchéma d'un commentaire pérsistante dans la base de données
// Params //
// user : l'utilisateur qui post le commentaire
// date: la date de création
// content : le contenu du commentaire

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
 // author: String,
  user:{type:Schema.Types.ObjectId, ref: "User"},
  date: {type: Date, default: Date.now },
  content: String
});


mongoose.model('Comment', CommentSchema);



