  const moment = require('moment-timezone');  
  const schemaOptions = {
  toObject: {  getters: true,  virtuals: true, versionKey: false, },
  toJSON: {  getters: true,  virtuals: true,   versionKey: false, },
  runSettersOnQuery: true,  };
  module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
     
	  company_id:{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "company"
	  },
	  action: String,
	  log: String,
	  color: String,
	  staff_id:{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "staff"
	  },
	  staff_log_id:{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "staff_log"
	  },
      updatedAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
	  createdAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
	  createdBy: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
	
    },schemaOptions
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Action_log = mongoose.model("action_logs", schema, "action_logs");
  return Action_log;
};

