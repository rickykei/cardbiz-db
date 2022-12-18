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
      name: String,
      code: String,
	  fname: String,
	  lname: String,
	  company_name_eng: String,
	  company_name_chi: String,
	  work_mail: String,
	  country: String,
	  website: String,
	  position: String,
	  work_tel: String,
	  address: String,
	  sub_division : String,
	  department: String,
	  banner: String,
	  mobile: String,
	  logo: String,
      no_of_license: Number,
      no_of_admin: Number,
	  smartcard_uid: String,
      status: Boolean,
      updatedAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
		createdAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') } 
    },schemaOptions
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Company = mongoose.model("company", schema);
  return Company;
};

