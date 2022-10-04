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
      fname: String,
	  lname: String,
	  headshot: String,
	  work_email: String,
	  home_email: String,
	  other_email: String,
	  position: String,
	  work_tel: String,
	  work_tel2: String,
	  mobile: String,
	  mobile2: String,
	  home_tel: String,
	  fax: String,
	  web_link: String,
	  web_link2: String,
	  web_link3: String,
	  web_link4: String,
	  web_link5: String,
	  web_link6: String,
	  address: String,
	  address2: String,
	  division: String,
	  department: String,
	  country: String,
	  bio: String,
	  company_website_url: String,
	  more_info_tab_url: String,
	  facebook_url: String,
	  instagram_url: String,
	  whatsapp_url: String,
	  linkedin_url: String,
	  youtube_url: String,
	  twitter_url: String,
	  wechat_id: String,
	  smartcard_uid: String,
	  bizcard_option: Boolean,
	  profile_counter: Number,
	  vcf_counter: Number,
	  status: Boolean, 
	  updated_by: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
	  created_by:   
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
