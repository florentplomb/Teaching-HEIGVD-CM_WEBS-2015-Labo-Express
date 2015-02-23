var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
 // author: String,
  user:{type:Schema.Types.ObjectId, ref: "User"},
  date: {type: Date, default: Date.now },
  content: String
});


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



mongoose.model('Comment', CommentSchema);



