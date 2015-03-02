// Modele Issue : défini le shchéma d'une action pérsistante dans la base de données
// Params //
// Status : défini le status d'une issue
// date : la date de création
// desc : la description de de l'issue
// user : l'utilisateur qui crée l'issue
// tag  : mot clé lié à l'issue
// issueType: le type d'issue
// geoData  : les coordonées de l'issues
// comment  : les commentaire lié à l'issues
// action  : les action effectuée sur l'issue


var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueSchema = new Schema({
                status: String,
                desc: String,
                date: {type: Date, default: Date.now},
                user:{type:Schema.Types.ObjectId, ref: "User"},
                tag:[{type:Schema.Types.ObjectId, ref: "Tag"}],
                issueType:[{type:Schema.Types.ObjectId, ref: "IssueType"}],  
                geoData:{  lg: Number,
                            lat:  Number},
                comment:[{type:Schema.Types.ObjectId, ref: "Comment"}],
                action:[{type:Schema.Types.ObjectId, ref: "Action"}]
	
});



mongoose.model('Issue', IssueSchema);

