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
	  company_name_eng: String,
	  company_name_chi: String,
	  fname:String,
	  lname:String,
	  staff_no: String,
	  headshot: String,
	  work_email: String,
	  work_email2: String,
	  work_email3: String,
	  home_email: String,
	  other_email: String,
	  position: String,
	  work_tel: String,
	  work_tel2: String,
	  work_tel3: String,
	  work_tel4: String,
	  mobile: String,
	  mobile2: String,
	  mobile3: String,
	  mobile4: String,
	  home_tel: String,
	  fax: String,
	  web_link: String,
	  web_link2: String,
	  web_link3: String,
	  web_link4: String,
	  web_link5: String,
	  web_link6: String,
	  web_link_label: String,
	  web_link_label2: String,
	  web_link_label3: String,
	  web_link_label4: String,
	  web_link_label5: String,
	  web_link_label6: String,
	  address: String,
	  address2: String,
	  address3: String,
	  address4: String,
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
	  wechatpage_url: String,
	  douyin_url: String,
	  tiktok_url: String,
	  kuaishou_url: String,
	  line_url: String,
	  facebook_messenger_url: String,
	  weibo_url:String,
	  bilibili_url: String,
	  qq_url: String,
	  zhihu_url : String,
	  app_store_url: String,
	  google_play_url: String,
	  snapchat_url: String,
	  telegram_url: String,
	  xiaohongshu_url: String,
	  note: String,
	  note_timestamp: Boolean,
	  smartcard_uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "smartcard"
      },
	  bizcard_option: Boolean,
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
  const Staff = mongoose.model("staff", schema);
  return Staff;
};
