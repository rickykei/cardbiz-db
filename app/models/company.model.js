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
      company_name: String,
      work_mail: String,
      country: String,
      website: String,
      position: String,
      work_tel: String,
      address: String,
      sub_division: String,
      department: String,
      banner: String,
      mobile: String,
      logo: String,
      profile_theme: String,
      no_of_license: Number,
      no_of_admin: Number,
      smartcard_uid: String,
      status: Boolean,
      wallet_field1_option: Number,
      wallet_field2_title: String,
      wallet_field2_option: Number,
      wallet_field3_title: String,
      wallet_field3_option: Number,
      wallet_logo_option: Number,
      wallet_banner: String,
      wallet_qrcode_option: Number,
      wallet_text_color: String,
      wallet_bg_color: String,
      wallet_status: Boolean,
      font_color: String,
      font_size: String,
      font_family: String,
      title_font_size: String,
      bg_color: String,
      text_color:String,
      title_text_color:String,
      social_icon_bg_color:String,
      button_color:String,
      links_hover_color:String,
      links_not_hover_color:String,
      links_selected_color:String,
      left_nav_bar_color:String,
      bio_wording_color:String,
      key_wording_color:String,
      site_bg_color:String,
      bg_image:String, 
      logo_display_option:{type: Boolean, default: true},
      headshot_display_option:{type: Boolean, default: true},
      updatedAt: { type: Date, default: Date.now, get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
      createdAt: { type: Date, default: Date.now, get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') }
    }, schemaOptions
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

