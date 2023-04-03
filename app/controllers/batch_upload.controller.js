const db = require("../models");
const Staffs = db.staffs;
const readXlsxFile = require('read-excel-file/node')
 var ObjectId = require('mongodb').ObjectId; 
const excel = require("exceljs");

exports.uploadStaffExcel =  async (req, res) => {
	try {
		let path =  __basedir + "/uploads/" + req.file.filename;
 	 
		if (req.file == undefined) {
		  return res.status(400).send("Please upload an excel file!");
		}
	let company_id=req.body.company_id;
	 var staffs = [];
	 var xls_staffs = [];
      var new_staffs = [];
	  var old_staffs = [];
	  
	  
   xls_staffs=await readXlsxFile(path).then((rows) => {
		 
      // skip header
      rows.shift();
 
     for(row of rows){
		for (let i = 0; i < 36; i++) {
			  if (row[i]==null || row[i]==undefined)
				  row[i]="";
			} 
		let y=0;	
        var staff = {
		  company_name_eng:row[y++],
		  company_name_chi:row[y++],
          fname: row[y++],
		  lname: row[y++],
		  company_id: company_id,
		  work_email: row[y++],
		  work_email2: row[y++],
		  work_email3: row[y++],
          home_email: row[y++],
          other_email: row[y++],
		  position:row[y++],
		  work_tel:row[y++],
		  work_tel2:row[y++],
		  work_tel3:row[y++],
		  work_tel4:row[y++],
		  mobile:row[y++],
		  mobile2:row[y++],
		  mobile3:row[y++],
		  mobile4:row[y++],
		  home_tel:row[y++],
		  fax:row[y++],
		  web_link:row[y++],
		  web_link2:row[y++],
		  web_link3:row[y++],
		  web_link4:row[y++],
		  web_link5:row[y++],
		  web_link6:row[y++],
		  web_link_label:row[y++],
		  web_link_label2:row[y++],
		  web_link_label3:row[y++],
		  web_link_label4:row[y++],
		  web_link_label5:row[y++],
		  web_link_label6:row[y++],
		  address:row[y++],
		  address2:row[y++],
		  address3:row[y++],
		  address4:row[y++],
		  staff_no: row[y++],
		  division :row[y++],
		  department:row[y++],
		  country:row[y++],
		  bio:row[y++],
		  company_website_url:row[y++],
		  more_info_tab_url:row[y++],
		  facebook_url:row[y++],
		  instagram_url:row[y++],
		  whatsapp_url:row[y++],
		  linkedin_url:row[y++],
		  youtube_url:row[y++],
		  twitter_url:row[y++],
		  wechat_id:row[y++],
		  wechatpage_url: row[y++],
		  tiktok_url: row[y++],
		  line_url: row[y++],
		  facebook_messenger_url: row[y++],
		  weibo_url: row[y++],
		  bilbili_url:row[y++],
		  qq_url: row[y++],
		  zhihu_url: row[y++],
		  app_store_url: row[y++],
		  google_play_url: row[y++],
		  snapchat_url: row[y++],
		  telegram_url: row[y++],
		  note: row[y++],
		  note_timestamp: row[y++],
		  smartcard_uid: row[y++],
		  bizcard_option: row[y++],
		  qrcode_option: row[y++],
		  status:row[y++],
        };

        staffs.push(staff);
		
      };
	  
	  
	   return staffs;
	   }
	);  
	 
	  for (var s of xls_staffs){
		  var query ={};
		   query.company_id =  ObjectId(company_id);
		   query.work_email =  s.work_email;
		let mongoDocument =  await Staffs.findOne(query).exec();
		
		if (mongoDocument!=undefined)
		{
			s.company_id=company_id;
			
			old_staffs.push(s);
			console.log("old doc id"+mongoDocument.id);
			await Staffs.findByIdAndUpdate(mongoDocument.id, s, { useFindAndModify: true });
		}else{
			s.company_id=company_id;
			new_staffs.push(s);
			
		}
	  }
	
	console.log("new"+new_staffs.length);
	console.log("old"+old_staffs.length);
	  	 
		  
	 Staffs.insertMany(new_staffs).then(function(){
			console.log("Data inserted")  // Success
			res.send({message: "done"});
		}).catch(function(error){
			console.log(error)      // Failure
		});
			 
	 res.send({message: "done",old_staffs,new_staffs});
  
	  
   
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
 
exports.uploadStaffExcelAddOnly =  (req, res) => {
	let path =  __basedir + "/uploads/" + req.file.filename;
 	
    try {
		if (req.file == undefined) {
		  return res.status(400).send("Please upload an excel file!");
		}
	let company_id=req.body.company_id;
    readXlsxFile(path).then((rows) => {
		
	  var staffs = [];
      var new_staffs = [];
	  var old_staffs = [];
      // skip header
      rows.shift();
 
      rows.forEach((row) => {
        var staff = {
          fname: row[0],
		  company_id: company_id,
		  company_name:row[1],
          work_email: row[2],
          home_email: row[3],
          other_email: row[4],
		  position:row[5],
		  work_tel:row[6],
		  work_tel2:row[7],
		  mobile:row[8],
		  mobile2:row[9],
		  home_tel:row[10],
		  fax:row[11],
		  web_link:row[12],
		  web_link2:row[13],
		  web_link3:row[14],
		  web_link4:row[15],
		  web_link5:row[16],
		  web_link6:row[17],
		  address:row[18],
		  address2:row[19],
		  division :row[20],
		  department:row[21],
		  country:row[22],
		  bio:row[23],
		  company_website_url:row[24],
		  more_info_tab_url:row[25],
		  facebook_url:row[26],
		  instagram_url:row[27],
		  whatsapp_url:row[28],
		  linkedin_url:row[29],
		  youtube_url:row[30],
		  twitter_url:row[31],
		  wechat_id:row[32],
		  smartcard_uid:row[33],
		  bizcard_option: row[34],
		  status:row[35],
        };

        staffs.push(staff);
		
      });
	  	 
	 Staffs.insertMany(staffs).then(function(){
    console.log("Data inserted")  // Success
	res.send({message: "done"});
}).catch(function(error){
    console.log(error)      // Failure
});
	 
	 
    });  
	  
   
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
 
exports.downloadStaffExcel =  (req, res) => {
	 const { company_id  } = req.query;
	if (company_id == undefined || company_id =="") {
		  return res.status(400).send("ERROR");
		}
	 
  Staffs.find({ company_id: company_id }).then((objs) => {
    let staffs = [];

    objs.forEach((obj) => {
      staffs.push({
		  
		  company_name_eng:obj.company_name_eng,
		  company_name_chi:obj.company_name_chi,
		  fname: obj.fname,
		  lname: obj.lname,
          work_email: obj.work_email,
		  work_email2: obj.work_email2,
		  work_email3: obj.work_email3,
		  home_email: obj.home_email,
          other_email: obj.other_email,
		  position:obj.position,
		  work_tel:obj.work_tel,
		  work_tel2:obj.work_tel2,
		  work_tel3:obj.work_tel3,
		  work_tel4:obj.work_tel4,
		  mobile:obj.mobile,
		  mobile2:obj.mobile2,
		  mobile3:obj.mobile3,
		  mobile4:obj.mobile4,
		  home_tel:obj.home_tel,
		  fax:obj.fax,
		  web_link:obj.web_link,
		  web_link2:obj.web_link2,
		  web_link3:obj.web_link3,
		  web_link4:obj.web_link4,
		  web_link5:obj.web_link5,
		  web_link6:obj.web_link6,
		  web_link_label:obj.web_link_label,
		  web_link_label2:obj.web_link_label2,
		  web_link_label3:obj.web_link_label3,
		  web_link_label4:obj.web_link_label4,
		  web_link_label5:obj.web_link_label5,
		  web_link_label6:obj.web_link_label6,
		  address:obj.address,
		  address2:obj.address2,
		  address3:obj.address3,
		  address4:obj.address4,
		  staff_no: obj.staff_no,
		  division :obj.division,
		  department:obj.department,
		  country:obj.country,
		  bio:obj.bio,
		  company_website_url:obj.company_website_url,
		  more_info_tab_url:obj.more_info_tab_url,
		  facebook_url:obj.facebook_url,
		  instagram_url:obj.instagram_url,
		  whatsapp_url:obj.whatsapp_url,
		  linkedin_url:obj.linkedin_url,
		  youtube_url:obj.youtube_url,
		  twitter_url:obj.twitter_url,
		  wechat_id:obj.wechat_id,
		  wechatpage_url: obj.wechatpage_url,
		  tiktok_url: obj.tiktok_url,
		  line_url:obj.line_url,
		  facebook_messenger_url: obj.facebook_messenger_url,
		  weibo_url: obj.weibo_url,
		  bilbili_url: obj.bilbili_url,
		  qq_url: obj.qq_url,
		  zhihu_url: obj.zhihu_url,
		  app_store_url:obj.app_store_url,
		  google_play_url: obj.google_play_url,
		  snapchat_url:obj.snapchat_url,
		  telegram_url: obj.telegram_url,
		  note: obj.note,
		  note_timestamp: obj.note_timestamp,
		  smartcard_uid: obj.smartcard_uid,
		  qrcode_option: obj.qrcode_option,
		  
		  bizcard_option: obj.bizcard_option,
		  status:obj.status,
         
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffs");

    worksheet.columns = [
	{ header: "company_name_eng", key: "company_name_eng", width: 25 },
	{ header: "company_name_chi", key: "company_name_chi", width: 25 },
      { header: "eng_name", key: "fname", width: 25 },
      { header: "chi_name", key: "lname", width: 25 },
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
	  { header: "staff_no", key: "staff_no", width: 25},
	  { header: "division", key: "division", width: 25 },
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
	  { header: "bilbili_url", key: "bilbili_url", width: 25 },
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
  });
};
