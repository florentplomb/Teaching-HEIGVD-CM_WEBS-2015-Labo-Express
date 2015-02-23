var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
  // Action type correspond au type d'action effectuée sur une issue
  // code : chaque type correspond à un code ( 0 : addComment , 1 : changeStatus ...)

var ActionTypeSchema = new Schema({
    code : Number, 
    type: String,
    desc: String
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



mongoose.model('ActionType', ActionTypeSchema);