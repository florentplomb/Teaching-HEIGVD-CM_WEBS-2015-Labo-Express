// Modele ActionType : défini le shchéma d'un action type pérsistante dans la base de données
// Params //
// code : défini un code pour chaque type d'action : chaque type correspond à un code ( 0 : addComment , 1 : changeStatus ...)
// type : la description du type
// desc : la description de l'action à effecuter


var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
var ActionTypeSchema = new Schema({
    code : Number, 
    type: String,
    desc: String
});


mongoose.model('ActionType', ActionTypeSchema);