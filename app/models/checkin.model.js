 const moment = require('moment'); // 👈 加上這行

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
        ref: "staff"
      },
	  company_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company"
      },
        ip: String,
        user_agent: String,
           updatedAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
        createdAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') } 
    },
    schemaOptions
  );
    schema.index({ company_id: 1,createdAt: -1 });

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
   schema.plugin(mongoosePaginate);
  const Checkin = mongoose.model("checkins", schema, "checkins");
  return Checkin;
};