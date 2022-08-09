module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      udid: String,
      company_id: Number,
      company_code: String,
	  fname: String,
	  lname: String,
	  headshot: String,
	  company_name: String,
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
	  dividion: String,
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
	  status: String, 
	  updatedBy: Number
	   
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Staff = mongoose.model("staff", schema);
  return Staff;
};
