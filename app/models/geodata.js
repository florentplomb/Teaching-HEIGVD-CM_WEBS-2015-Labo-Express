// Modele GeoData : défini le shchéma d'un geodata pérsistante dans la base de données pour définir à la position d'une issue
// Params //
// actionType : le type d'action à effecuté
// lg :  longitude 
// lat : latitude

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GeoDataSchema = new Schema({
  lg: String,
  lat: String

});



mongoose.model('GeoData', GeoDataSchema);

