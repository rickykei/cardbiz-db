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
      udid: String,
      company_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company"
      },
	  rc_no: String,
	  staff_no: String,
	  name_eng:String,
	  name_chi:String,
	  company_name_eng: String,
	  company_name_chi: String,
	  title_eng: String,
	  title_chi: String,
	  pro_title: String,
	  subsidiary_eng: String,
	  subsidiary_chi: String,
      address_eng: String,
	  address_chi: String,
	  headshot: String,
	  work_tel: String,
	  work_tel2: String,
	  work_tel3: String,
	  direct_tel: String,
	  direct_tel2: String,
	  direct_tel3: String,
	  mobile_tel: String,
	  mobile_tel2: String,
	  mobile_tel3: String,
	  mobile_tel4: String,
	  mobile_tel5: String,
	  fax_no: String,
	  fax_no2: String,
	  fax_no3: String,
	  fax_no4: String,
	  fax_no5: String,
	  reuters: String,
	  work_email: String,
	  agent_no: String,
	  broker_no: String,
	  mpf_no: String,
	  hkma_no: String,
	  hkma_eng: String,
	  hkma_chi: String,
	  smartcard_uid: String,
	  bizcard_option: Boolean,
	  profile_counter: Number,
	  vcf_counter: Number,
	  status: Boolean, 
	  updatedBy: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
	  createdBy:   
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
	  updatedAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
	  createdAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') } 
    },schemaOptions
    
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Staff = mongoose.model("staff", schema);
  return Staff;
};
