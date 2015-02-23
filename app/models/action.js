var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ActionSchema = new Schema({
    test: String,
    actionType:{type:Schema.Types.ObjectId, ref: "ActionType"},
    date: {type: Date, default: '12/10/2010' },
    desc: String,
    user:{type:Schema.Types.ObjectId, ref: "User"}
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




mongoose.model('Action', ActionSchema);