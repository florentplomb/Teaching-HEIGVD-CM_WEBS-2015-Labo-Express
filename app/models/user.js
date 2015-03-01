// Modele User : défini le shchéma d'un user pérsistante dans la base de données 
// Params //
// firstname: prénom du user
// lasttname: nom du user
// phone :  téléphone 
// role : le role du user
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstname: String,
  lastname: String,
  phone: String,
	roles: [ String ]
});


UserSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('User', UserSchema);

