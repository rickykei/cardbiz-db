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
	  action_log_id:
	  {
		type: mongoose.Schema.Types.ObjectId,
        ref: "action_log"
	  },
	  staff_id:
	  {
		type: mongoose.Schema.Types.ObjectId,
        ref: "staff"
	  },
      udid: String,
      company_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company"
      }, 
	  company_name_option: Number,
	  company_name_eng: String,
	  company_name_chi: String,
	  company_name_eng2: String,
	  company_name_chi2: String,
	  company_name_eng3: String,
	  company_name_chi3: String,
	  fname:String,
	  lname:String,
	  staff_no:String,
	  cc_no:String,
	  app_id:String,
	  title_eng: String,
	  title_chi: String,
	  title_eng2: String,
	  title_chi2: String,
	  pro_title: String,
	  division_eng: String,
	  division_chi: String,
	  dept_eng: String,
	  dept_chi: String,
	  address_eng: String,
	  address_chi: String,
	  address_eng2: String,
	  address_chi2: String,
	  work_tel: String,
	  work_tel2: String,
	  work_tel3: String,
	  direct_tel: String,
	  direct_tel2: String,
	  direct_tel3: String,
	  mobile: String,
	  mobile2: String,
	  mobile3: String,
	  mobile_china_tel: String,
	  mobile_china_tel2: String,
	  mobile_china_tel3: String,
	  fax: String,
	  swift_no: String,
	  work_email: String,
	  work_email2: String,
	  work_email3: String,
	  web_link: String,
	  web_link2: String,
	  web_link3: String,
	  web_link_label: String,
	  web_link_label2: String,
	  web_link_label3: String,
	  agent_no: String,
	  insurance_no: String,
	  mpf_no: String,
	  hkma_no: String,
	  type1_no: String,
	  type4_no: String,
	  type6_no: String,
	  type9_no: String,
	  reuters_code: String,
	  bloomberg_info: String,
	  sfc_no: String,
	  sfc_type1_no: String,
	  sfc_type2_no: String,
	  field051: String,
	  field052: String,
	  field053: String,
	  field054: String,
	  field055: String,
	  field056: String,
	  field057: String,
	  field058: String,
	  field059: String,
	  field060: String,
	  field061: String,
	  field062: String,
	  field063: String,
	  field064: String,
	  field065: String,
	  field066: String,
	  field067: String,
	  field068: String,
	  field069: String,
	  field070: String, 
	  additional_info: String,
	  note: String,
	  note_timestamp: Boolean,
	  smartcard_uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "smartcard"
      },
	  bizcard_option: Boolean,
	  dig_card_in_vcf: Boolean,
	  qrcode_option: Number,
	  profile_counter: Number,
	  vcf_counter: Number,
	  note: String,
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
  const Staff_log = mongoose.model("staff_logs", schema, "staff_logs");
  return Staff_log;
};
