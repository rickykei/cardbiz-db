  const moment = require('moment-timezone');  
  const schemaOptions = {
  toObject: {  getters: true,  virtuals: true, versionKey: false, },
  toJSON: {  getters: true,  virtuals: true,   versionKey: false, },
  runSettersOnQuery: true,  };
  module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
     
	  user_id:{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "user"
	  },
	  username: String,
	  token: String,
	  updatedAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
	  createdAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
	  
    },schemaOptions
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Two_factors = mongoose.model("two_factors", schema, "two_factors");
  return Two_factors;
};

