const moment = require('moment-timezone');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    fname: String,
    lname: String,
    mname: String,
    pname: String,
    oname: String,
    pdname: String,
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
    weibo_url: String,
    bilibili_url: String,
    qq_url: String,
    zhihu_url: String,
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
    save_contact_button: { type: Boolean, default: true },
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
    updatedAt: { type: Date, default: Date.now, get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
    createdAt: { type: Date, default: Date.now, get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') }
  }, schemaOptions
);

// 刪除員工 pre hook
schema.pre('findByIdAndRemove', async function (next) {
  const staff = await this.model.findOne(this.getFilter());
  if (!staff?.headshot) return next();

  // headshot 係 filename，搵 photos.files
  const photoFile = await mongoose.model('photos.files').findOne({
    filename: staff.headshot
  });
  if (!photoFile) return next();

  // 先刪 files，再刪 chunks
  await mongoose.model('photos.files').deleteOne({ _id: photoFile._id });
  await mongoose.model('photos.chunks').deleteMany({ files_id: photoFile._id });

  next();
});

// 更新員工 pre hook：換新 headshot(filename)，刪舊圖
schema.pre('findOneAndUpdate', async function (next) {
  const oldStaff = await this.model.findOne(this.getFilter());
  if (!oldStaff?.headshot) return next();

  const update = this.getUpdate();
  const newHeadshotFilename = update.$set?.headshot ?? update.headshot;
  // 無更新 headshot，直接跳過
  if (!newHeadshotFilename) return next();

  // 新舊 filename 一樣，唔使刪
  if (oldStaff.headshot === newHeadshotFilename) return next();

  // 搵舊嘅 photo file
  const oldPhotoFile = await mongoose.model('photos.files').findOne({
    filename: oldStaff.headshot
  });
  if (oldPhotoFile) {
    await mongoose.model('photos.files').deleteOne({ _id: oldPhotoFile._id });
    await mongoose.model('photos.chunks').deleteMany({ files_id: oldPhotoFile._id });
  }

  next();
});

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// ⚠️ plugin 必須在 model 之前
schema.plugin(mongoosePaginate);

const Staff = mongoose.model("staff", schema);
module.exports = Staff;