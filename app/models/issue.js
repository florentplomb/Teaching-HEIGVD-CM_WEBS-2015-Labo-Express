var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IssueSchema = new Schema({
                tag: String,
                status: String,
                desc: String,
                date: Date,
                issueType:{type:Schema.Types.ObjectId, ref: "issueType"},
                user:{type:Schema.Types.ObjectId, ref: "user"},             
                geoData:{type:Schema.Types.ObjectId, ref: "GeoData"}, 
                comment:{type:Schema.Types.ObjectId, ref: "Comment"}
	
});

//
//Issue.pre('save', function(next) {
//    this.updatedOn = new Date();
//    next();
//});
    


// Example of how we can use mongoose to transform data from the DB into
// an object we can use. It's a sort of Entity <-> TO transformation

//if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
//UserSchema.options.toObject.hide = '';
//UserSchema.options.toObject.transform = function (doc, ret, options) {
//  if (options.hide) {
//    options.hide.split(' ').forEach(function (prop) {
//      delete ret[prop];
//    });
//  }
//	ret.id = ret._id;
//	delete ret['_id'];
//	delete ret['__v'];
//}


mongoose.model('Issue', IssueSchema);

