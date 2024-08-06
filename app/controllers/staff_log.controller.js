const upload = require("../middleware/upload");
 
const db = require("../models");

var ObjectId = require('mongodb').ObjectId; 
const Staff_log = db.staff_log;
const readXlsxFile = require('read-excel-file/node')
const excel = require("exceljs")

const getPagination = (page, size) => {
	const limit = size ? +size : 5;
	const offset = page ? page* limit : 0;
	return { limit, offset };
};

let uploadFiles=""; 

 
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  console.log("entered Stafflog.findall");
  const populate=['company_id','createdBy','updatedBy'];
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { name_eng: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{ updatedAt:-1,_id:1  };
 
    let queryArray=[];
  let query={};  
		
	 
  
  Staff_log.paginate(query, { populate,offset, limit , sort})
    .then(data => {
      res.send({
        status: data.status,
        totalItem: data.totalDocs,
        totalPage: data.totalPages,
    currentPage: data.page,
        pageSize: pageSize*1,
        data: data.docs,
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving staffs."
      });
    });
};
 

exports.downloadStaffLogExcel =  (req, res) => {
  console.log("entered stafflog.downloadStaffLogExcel");
  const populate=['company_id','smartcard_uid','createdBy','updatedBy'];
  const { company_id, uid  } = req.query;
   let query={};
   
	if (company_id == undefined || company_id =="" || uid=="" || uid == undefined) {
		  return res.status(400).send("ERROR");
		}
	 
	 
	 if (company_id!="63142fd5b54bdbb18f556016")
	 {
	 
			query.company_id = ObjectId(company_id);
	 
		console.log("non nfc");
	 }else{
		  
		 console.log("nfc");
	 }
	 
	  console.log(query);
  Staff_log.find(query).populate(populate)
  .then((objs) => {
   
    //prepare excel Array
	 let staffs = [];

    objs.forEach((obj) => {
		 
		 
		if (!obj['updatedBy'])
		{ 
			 		
			obj.updatedBy=ObjectId('639d828082de296c1eabf6a7');
			if (!obj.hasOwnProperty('updatedBy.username'))	
			obj.updatedBy.username='No username';
			
		}
		 	let updateDate=obj.updatedAt.split(' ');
      staffs.push({
		  updatedAtDate: updateDate[0],
		  updatedAtTime: updateDate[1],
		  updatedBy: obj.updatedBy.username,
		  company_name_eng: obj.company_name_eng,
		  company_name_chi: obj.company_name_chi,
		  fname: obj.fname,
		  lname: obj.lname,
		  mname: obj.mname,
		  pname: obj.pname,
		  oname: obj.oname,
		  pdname: obj.pdname,
		  work_email: obj.work_email,
		  work_email2: obj.work_email2,
		work_email3: obj.work_email3,
		home_email: obj.home_email,
		other_email: obj.other_email,
		position: obj.position,
		work_tel: obj.work_tel,
		work_tel2: obj.work_tel2,
		work_tel3: obj.work_tel3,
		work_tel4: obj.work_tel4,
		mobile: obj.mobile,
		mobile2: obj.mobile2,
		mobile3: obj.mobile3,
		mobile4: obj.mobile4,
		home_tel: obj.home_tel,
		fax: obj.fax,
		web_link: obj.web_link,
		web_link2: obj.web_link2,
		web_link3: obj.web_link3,
		web_link4: obj.web_link4,
		web_link5: obj.web_link5,
		web_link6: obj.web_link6,
		web_link_label: obj.web_link_label,
		web_link_label2: obj.web_link_label2,
		web_link_label3: obj.web_link_label3,
		web_link_label4: obj.web_link_label4,
		web_link_label5: obj.web_link_label5,
		web_link_label6: obj.web_link_label6,
		address: obj.address,
		address2: obj.address2,
		address3: obj.address3,
		address4: obj.address4,
		staff_no: obj.staff_no,
		division: obj.division,
		department: obj.department,
		country: obj.country,
		bio : obj.bio,
		company_website_url : obj.company_website_url,
		more_info_tab_url : obj.more_info_tab_url,
		facebook_url: obj.facebook_url,
		instagram_url : obj.instagram_url,
		whatsapp_url : obj.whatsapp_url,
		linkedin_url : obj.linkedin_url,
		youtube_url : obj.youtube_url,
		twitter_url : obj.twitter_url,
		wechat_id : obj.wechat_id,
		wechatpage_url: obj.wechatpage_url,
		tiktok_url: obj.tiktok_url,
		line_url: obj.line_url,
		facebook_messenger_url: obj.facebook_messenger_url,
		weibo_url: obj.weibo_url,
		bilibili_url: obj.bilibili_url,
		qq_url: obj.qq_url,
		zhihu_url: obj.zhihu_url,
		app_store_url: obj.app_store_url,
		google_play_url: obj.google_play_url,
		snapchat_url: obj.snapchat_url,
		telegram_url: obj.telegram_url, 
		
		note: obj.note,
		note_timestamp: obj.note_timestamp,
		smartcard_uid: obj.smartcard_uid?obj.smartcard_uid.uid:null,
		bizcard_option: obj.bizcard_option,
		dig_card_in_vcf: obj.dig_card_in_vcf,
		qrcode_option: obj.qrcode_option,
		status:obj.status, 
      });
    });
	
	//gen excel
	   let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffslog");

    worksheet.columns = [
	 
		{ header: "updatedAtDate", key: "updatedAtDate", width: 25 },
		  { header: "updatedAtTime", key: "updatedAtTime", width: 25 },
      { header: "updatedBy", key: "updatedBy", width: 25 },
		{ header: "company_name_eng", key: "company_name_eng", width: 25 },
      { header: "company_name_chi", key: "company_name_chi", width: 25 },
      { header: "first_name", key: "fname", width: 25 },
      { header: "last_name", key: "lname", width: 25 },
	  { header: "name_middle", key: "mname", width: 25 },
	  { header: "name_prefix", key: "pname", width: 25 },
	  { header: "name_other", key: "oname", width: 25 },
	  { header: "name_predes", key: "pdname", width: 25 },
      { header: "work_email", key: "work_email", width: 25 },
      { header: "work_email2", key: "work_email2", width: 25 },
	  { header: "work_email3", key: "work_email3", width: 25 },
	  { header: "home_email", key: "home_email", width: 25 },
	  { header: "other_email", key: "other_email", width: 25 },
	  { header: "position", key: "position", width: 25 },
	  { header: "work_tel", key: "work_tel", width: 25 },
	  { header: "work_tel2", key: "work_tel2", width: 25 },
	  { header: "work_tel3", key: "work_tel3", width: 25 },
	  { header: "work_tel4", key: "work_tel4", width: 25 },
	  { header: "mobile", key: "mobile", width: 25 },
	  { header: "mobile2", key: "mobile2", width: 25 },
	  { header: "mobile3", key: "mobile3", width: 25 },
	  { header: "mobile4", key: "mobile4", width: 25 },
	  { header: "home_tel", key: "home_tel", width: 25 },
	  { header: "fax", key: "fax", width: 25 },
	  { header: "web_link", key: "web_link", width: 25 },
	  { header: "web_link2", key: "web_link2", width: 25 },
	  { header: "web_link3", key: "web_link3", width: 25 },
	  { header: "web_link4", key: "web_link4", width: 25 },
	  { header: "web_link5", key: "web_link5", width: 25 },
	  { header: "web_link6", key: "web_link6", width: 25 },
	  { header: "web_link_label", key: "web_link_label", width: 25 },
	  { header: "web_link_label2", key: "web_link_label2", width: 25 },
	  { header: "web_link_label3", key: "web_link_label3", width: 25 },
	  { header: "web_link_label4", key: "web_link_label4", width: 25 },
	  { header: "web_link_label5", key: "web_link_label5", width: 25 },
	  { header: "web_link_label6", key: "web_link_label6", width: 25 },
	  { header: "address", key: "address", width: 25 },
	  { header: "address2", key: "address2", width: 25 },
	  { header: "address3", key: "address3", width: 25 },
	  { header: "address4", key: "address4", width: 25 },
	  { header: "staff_no", key: "staff_no", width: 25 },
	  { header: "division ", key: "division", width: 25 },
	  { header: "department", key: "department", width: 25 },
	  { header: "country", key: "country", width: 25 },
	  { header: "bio", key: "bio", width: 25 },
	  { header: "company_website_url", key: "company_website_url", width: 25 },
	    { header: "more_info_tab_url", key: "more_info_tab_url", width: 25 },
	    { header: "facebook_url", key: "facebook_url", width: 25 },
	    { header: "instagram_url", key: "instagram_url", width: 25 },
	    { header: "whatsapp_url", key: "whatsapp_url", width: 25 },
	    { header: "linkedin_url", key: "linkedin_url", width: 25 },
	    { header: "youtube_url", key: "youtube_url", width: 25 },
	    { header: "twitter_url", key: "twitter_url", width: 25 },
	      { header: "wechat_id", key: "wechat_id", width: 25 },
	    { header: "wechatpage_url", key: "wechatpage_url", width: 25 },
	   
	    { header: "tiktok_url", key: "tiktok_url", width: 25 },
	     
	    { header: "line_url", key: "line_url", width: 25 },
		   { header: "facebook_messenger_url", key: "facebook_messenger_url", width: 25 },
	    { header: "weibo_url", key: "weibo_url", width: 25 },
	    { header: "bilibili_url", key: "bilibili_url", width: 25 },
	    { header: "qq_url", key: "qq_url", width: 25 },
	    { header: "zhihu_url", key: "zhihu_url", width: 25 },
	    { header: "app_store_url", key: "app_store_url", width: 25 },
		   { header: "google_play_url", key: "google_play_url", width: 25 },
	    { header: "snapchat_url", key: "snapchat_url", width: 25 },
	    { header: "telegram_url", key: "telegram_url", width: 25 },
	   
	    { header: "note", key: "note", width: 25 },
	    { header: "note_timestamp", key: "note_timestamp", width: 25 },
	  { header: "smartcard_uid", key: "smartcard_uid", width: 25 },
	  { header: "bizcard_option", key: "bizcard_option", width: 25 },
	  { header: "dig_card_in_vcf", key: "dig_card_in_vcf", width: 25 },
	   { header: "qrcode_option", key: "qrcode_option", width: 25 },
	  { header: "status", key: "status", width: 25 },
    ];

    // Add Array Rows
    worksheet.addRows(staffs);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "staffs.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
	//gen excel 
  });
   
};

 