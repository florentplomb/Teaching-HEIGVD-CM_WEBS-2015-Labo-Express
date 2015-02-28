
// Modele Action : défini le shchéma d'une action pérsistante dans la base de données
// Params //
// actionType : le type d'action à effecuté
// date : la date de création
// desc : la description de l'action 
// user : l'utilisateur qui effectue l'action
// issue : l'issue sur laquelle l'action est effectuée

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ActionSchema = new Schema({
   
    actionType:{type:Schema.Types.ObjectId, ref: "ActionType"},
    date: {type: Date, default: Date.now },
    desc: String,
    user:{type:Schema.Types.ObjectId, ref: "User"},
    issue:{type:Schema.Types.ObjectId, ref: "Issue"}
});



mongoose.model('Action', ActionSchema);