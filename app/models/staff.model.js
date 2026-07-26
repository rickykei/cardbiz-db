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
	  mname:String,
	  pname:String,
	  oname:String,
	  pdname:String,
	  headshot: String,
	  work_email: String,
	  work_email2: String,
	  work_email3: String,
	  home_email: String,
	  other_email: String,
	  work_email_label: String,
	  work_email2_label: String,
	  work_email3_label: String,
	  home_email_label: String,
	  other_email_label: String,
	  position: String,
	  position_other_lang: String,
	  work_tel: String,
	  work_tel2: String,
	  work_tel3: String,
	  work_tel4: String,
	  work_tel_label: String,
	  work_tel2_label: String,
	  work_tel3_label: String,
	  work_tel4_label: String,
	  mobile: String,
	  mobile2: String,
	  mobile3: String,
	  mobile4: String,
	  home_tel: String,
	  fax: String,
	  mobile_label: String,
	  mobile2_label: String,
	  mobile3_label: String,
	  mobile4_label: String,
	  home_tel_label: String,
	  fax_label: String,
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
	  address_label: String,
	  address2_label: String,
	  address3_label: String,
	  address4_label: String,
	  staff_no: String,
	  division: String,
	  department: String,
	  country: String,
	  bio: String,
	  awards: String,
	  qualifications: String,
	  additional_address: String,
	  achievements: String,
	  company_website_url: String,
	  more_info_tab_url: String,
	  facebook_url: String,
	  instagram_url: String,
	  whatsapp_url: String,
	  linkedin_url: String,
	  youtube_url: String,
	  twitter_url: String,
	  wechat_id: String,
	  wechat_qr_url: String,
	  wechatpage_url: String,	  
	  tiktok_url: String,	  
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
	  note_timestamp: { type: Boolean, default: true },
	  smartcard_uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "smartcard" 
      },
	  bizcard_option: Number,
	  dig_card_in_vcf: { type: Boolean, default: true },
	  qrcode_option: Number,
	  minisite_option: Number,
	  profile_counter: Number,
	  vcf_counter: Number,	   
	  status: { type: Boolean, default: true },
	  preloader: { type: Boolean, default: true },
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

// ------------------------------
// 當 刪除員工 → 自動刪除頭像
// ------------------------------
  schema.pre('findOneAndDelete', async function(next) {
  const staff = await this.model.findOne(this.getFilter());
  if (staff?.headshot) {
    const photoId = staff.headshot;

    // 刪除 photos.files
    await mongoose.model('photos.files').deleteOne({ _id: photoId });
    
    // 刪除 photos.chunks
    await mongoose.model('photos.chunks').deleteMany({ files_id: photoId });
  }
  next();
});

// ------------------------------
// 當 修改員工 → 更換頭像時 → 自動刪除「舊頭像」
// ------------------------------
schema.pre('findOneAndUpdate', async function(next) {
  const oldStaff = await this.model.findOne(this.getFilter());
  
  // 如果原本有舊頭像，而且即將被改成新的
  if (oldStaff?.headshot && this._update.headshot) {
    const oldPhotoId = oldStaff.headshot;
    const newPhotoId = this._update.headshot;

    if (oldPhotoId.toString() !== newPhotoId.toString()) {
      // 刪除舊圖片
      await mongoose.model('photos.files').deleteOne({ _id: oldPhotoId });
      await mongoose.model('photos.chunks').deleteMany({ files_id: oldPhotoId });
    }
  }
  next();
});


  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Staff = mongoose.model("staff", schema);
  return Staff;
};
