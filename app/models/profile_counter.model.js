const moment = require('moment-timezone');

 const schemaOptions = {
  toObject: {
    getters: true,    
	virtuals: true,
    versionKey: false,
  },
  toJSON: {
    getters: true,
    virtuals: true,
    versionKey: false,
  },
  runSettersOnQuery: true,
  };

module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      staff_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffs"
      },
      ip: String,
	  user_agent: String,
	  updatedAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
	  createdAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') } 
    } , schemaOptions
  );
     
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);
  const Profile_counter = mongoose.model("profile_counters", schema, "profile_counters");
  return Profile_counter;
};

