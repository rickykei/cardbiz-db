const db = require("../models");
const readXlsxFile = require('read-excel-file/node')
var ObjectId = require('mongodb').ObjectId; 
const excel = require("exceljs");
const Action_log = db.action_log;
const Staff_log = db.staff_log;
const Staff = db.staffs;
const profileUrl=db.profileUrl;
const CryptoJS = require('crypto-js');

function AES_ENCRYPT(text, secretKey) {
	const encrypted = CryptoJS.AES.encrypt(text,secretKey ,{
	 mode: CryptoJS.mode.CBC,
	 padding: CryptoJS.pad.Pkcs7
   }).toString();
   return encrypted;
  } 

exports.uploadStaffExcel =  async (req, res) => {
	try {
		let path =  __basedir + "/uploads/" + req.file.filename;
 	 
		if (req.file == undefined) {
		  return res.status(400).send("Please upload an excel file!");
		}
	let company_id=req.body.company_id;
	let uid=req.body.uid;  //admin staff doc id
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
		  mname: row[y++],
		  pname: row[y++],
		  oname: row[y++],
		  pdname: row[y++],
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
		  bilibili_url:row[y++],
		  qq_url: row[y++],
		  zhihu_url: row[y++],
		  app_store_url: row[y++],
		  google_play_url: row[y++],
		  snapchat_url: row[y++],
		  telegram_url: row[y++],
		  note: row[y++],
		  note_timestamp: row[y++],
		  bizcard_option: row[y++],
		  dig_card_in_vcf: row[y++], 
		  qrcode_option: row[y++],
		  minisite_option: row[y++],
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

		   //20240702 replace unique key from email to staff_id
		   //query.work_email =  s.work_email;
		   query.staff_no =  s.staff_no;

		   //if excel status empty fill true 20240803
			if (s.status!=false)
				s.status=true;

		let mongoDocument =  await Staff.findOne(query).exec();
		
		if (mongoDocument!=undefined)
		{
			s.company_id=company_id; 
			old_staffs.push(s);
			console.log("old doc id"+mongoDocument.id);
			
			//batch update excel staff one by one
			Staff.findByIdAndUpdate(mongoDocument.id, s, {new: true, useFindAndModify: true })
			.then(data => {
					if (!data) {
						res.status(404).send({
						  message: `Cannot update Staff with id=${id}. Maybe Staff was not found!`
						});
					} else  {
				 
						//write action log for those updated staff by batchuploader
						const actionLog = new Action_log({
							action: "Batch Update Staff Records",
							log: data.fname,
							company_id: data.company_id,
							staff_id: data.id,
							updatedBy: ObjectId(uid), 
							createdAt: Date.now(), 
							updatedAt: Date.now(),
							color: "border-theme-1",
						});
						
						actionLog.save(actionLog)
						.then(data2 => {
							if (!data2){
								res.status(404).send({
									message: `Cannot update Staff with id=${id}. Maybe Staff was not found!`
									});
							}else{
								//backup old staff records to table staff_logs
								console.log("actionLog save for edit");
								 
								console.log(data);
								staff_log = new Staff_log({
									action_log_id: ObjectId(data2.id),
									staff_id: ObjectId(data._id),
									udid:data.udid,
									company_id: data.company_id,
									company_name_eng: data.company_name_eng,
									company_name_chi: data.company_name_chi,
									fname: data.fname,
									lname: data.lname,
									mname: data.mname,
									pname: data.pname,
									oname: data.oname,
									pdname: data.pdname,
									  headshot: data.headshot,
									  work_email: data.work_email,
									  work_email2: data.work_email2,
									  work_email3: data.work_email3,
									  home_email: data.home_email,
									  other_email: data.other_email,
									  position: data.position,
									    work_tel: data.work_tel,
									  work_tel2: data.work_tel2,
									  work_tel3: data.work_tel3,
									  work_tel4: data.work_tel4,
									    mobile: data.mobile,
									  mobile2: data.mobile2,
									  mobile3: data.mobile3,
									  mobile4: data.mobile4,
									  home_tel: data.home_tel,
									  fax: data.fax,
									  web_link: data.web_link,
									  web_link2: data.web_link2,
									  web_link3: data.web_link3,
									  web_link4: data.web_link4,
									  web_link5: data.web_link5,
									  web_link6: data.web_link6,
									  
									  web_link_label: data.web_link_label,
									  web_link_label2: data.web_link_label2,
									  web_link_label3: data.web_link_label3,
									  web_link_label4: data.web_link_label4,
									  web_link_label5: data.web_link_label5,
									  web_link_label6: data.web_link_label6,
									  
									  address: data.address,
									  address2: data.address2,
									  address3: data.address3,
									  address4: data.address4,
									 staff_no: data.staff_no,
									
									  division: data.division,
									  
									  department: data.department,
									  
									  country: data.country,
									  
									  bio: data.bio,
									  
									  company_website_url: data.company_website_url,
									  more_info_tab_url: data.more_info_tab_url,
									  facebook_url: data.facebook_url,
									  instagram_url: data.instagram_url,
									  whatsapp_url: data.whatsapp_url,
									  linkedin_url: data.linkedin_url,
									  youtube_url: data.youtube_url,
									  twitter_url: data.twitter_url,
									  wechat_id: data.wechat_id,
									  wechatpage_url: data.wechatpage_url,
									  tiktok_url: data.tiktok_url,
									  line_url: data.line_url,
									  facebook_messenger_url: data.facebook_messenger_url,
									  weibo_url: data.weibo_url,
									  bilibili_url: data.bilibili_url,
									  qq_url: data.qq_url,
									  zhihu_url: data.zhihu_url,
									  app_store_url: data.app_store_url,
									  google_play_url: data.google_play_url,
									  snapchat_url: data.snapchat_url,
									  telegram_url: data.telegram_url,
									  
									  note: data.note,
									  note_timestamp: data.note_timestamp,
									  
									  smartcard_uid: data.smartcard_uid,
									  bizcard_option: data.bizcard_option,
									  dig_card_in_vcf: data.dig_card_in_vcf,
									  qrcode_option: data.qrcode_option,
									  minisite_option: data.minisite_option,
									  profile_counter: data.profile_counter,
									  vcf_counter: data.vcf_counter,
									 
									  status: data.status, 
									  updatedBy: ObjectId(uid), 
									  createdBy: data.createdBy, 
									  createdAt: data.createdAt, 
									  updatedAt: Date.now(),
								});
								  
								staff_log.save(staff_log);
							//backup old staff records to table staff_logs
							}
						});
						 //white action log before send successful
					}
			});
		}else{
			s.company_id=company_id; 
			new_staffs.push(s);
			console.log("new doc id");
			
			 // Save Staff in the database
			 var staff=new Staff(s);
			staff.save(s)
				.then(data => {
					 //white action log before send successfully
					 const actionLog = new Action_log({
						action: "Batch Create Staff",
						log: data.fname,
						company_id: data.company_id,
						staff_id: data.id,
						createdBy: data.createdBy,
						color: "border-theme-1",
					});
					
					actionLog.save(actionLog).then(data2 => {
										if (!data2){
											res.status(404).send({
												message: `Cannot update Staff with id=${id}. Maybe Staff was not found!`
												});
										}else{
					 //white action log before send successfully
					 
								//backup old staff records to table staff_logs
											console.log("actionLog save for create");
											 
											console.log(data);
											staff_log = new Staff_log({
												action_log_id: ObjectId(data2.id),
												staff_id: ObjectId(data._id),
												udid:data.udid,
												company_id: data.company_id,
												company_name_eng: data.company_name_eng,
												company_name_chi: data.company_name_chi,
												fname: data.fname,
												lname: data.lname,
												mname: data.mname,
												pname: data.pname,
												oname: data.oname,
												pdname: data.pdname,
												  headshot: data.headshot,
												  work_email: data.work_email,
												  work_email2: data.work_email2,
												  work_email3: data.work_email3,
												  home_email: data.home_email,
												  other_email: data.other_email,
												  position: data.position,
													work_tel: data.work_tel,
												  work_tel2: data.work_tel2,
												  work_tel3: data.work_tel3,
												  work_tel4: data.work_tel4,
													mobile: data.mobile,
												  mobile2: data.mobile2,
												  mobile3: data.mobile3,
												  mobile4: data.mobile4,
												  home_tel: data.home_tel,
												  fax: data.fax,
												  web_link: data.web_link,
												  web_link2: data.web_link2,
												  web_link3: data.web_link3,
												  web_link4: data.web_link4,
												  web_link5: data.web_link5,
												  web_link6: data.web_link6,
												  
												  web_link_label: data.web_link_label,
												  web_link_label2: data.web_link_label2,
												  web_link_label3: data.web_link_label3,
												  web_link_label4: data.web_link_label4,
												  web_link_label5: data.web_link_label5,
												  web_link_label6: data.web_link_label6,
												  
												  address: data.address,
												  address2: data.address2,
												  address3: data.address3,
												  address4: data.address4,
												 staff_no: data.staff_no,
												
												  division: data.division,
												  
												  department: data.department,
												  
												  country: data.country,
												  
												  bio: data.bio,
												  
												  company_website_url: data.company_website_url,
												  more_info_tab_url: data.more_info_tab_url,
												  facebook_url: data.facebook_url,
												  instagram_url: data.instagram_url,
												  whatsapp_url: data.whatsapp_url,
												  linkedin_url: data.linkedin_url,
												  youtube_url: data.youtube_url,
												  twitter_url: data.twitter_url,
												  wechat_id: data.wechat_id,
												  wechatpage_url: data.wechatpage_url,
												  tiktok_url: data.tiktok_url,
												  line_url: data.line_url,
												  facebook_messenger_url: data.facebook_messenger_url,
												  weibo_url: data.weibo_url,
												  bilibili_url: data.bilibili_url,
												  qq_url: data.qq_url,
												  zhihu_url: data.zhihu_url,
												  app_store_url: data.app_store_url,
												  google_play_url: data.google_play_url,
												  snapchat_url: data.snapchat_url,
												  telegram_url: data.telegram_url,
												  
												  note: data.note,
												  note_timestamp: data.note_timestamp,
												  
												  smartcard_uid: data.smartcard_uid,
												  bizcard_option: data.bizcard_option,
												  dig_card_in_vcf: data.dig_card_in_vcf,
												  qrcode_option: data.qrcode_option,
												  minisite_option: data.minisite_option,
												  profile_counter: data.profile_counter,
												  vcf_counter: data.vcf_counter,
												 
												  status: data.status, 
												  updatedBy: ObjectId(uid), 
												  createdBy: data.createdBy, 
												  createdAt: data.createdAt, 
												  updatedAt: Date.now(),
											});
											console.log("copy staff_log");
											  console.log(staff_log);
											staff_log.save(staff_log);
										
										//backup old staff records to table staff_logs
										}
										});
				 
				})
		}
	  }
	
	console.log("new"+new_staffs.length);
	console.log("old"+old_staffs.length);
	  	 
	 
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
		  bizcard_option: row[33],
		  status:row[34],
        };

        staffs.push(staff);
		
      });
	  	 
	 Staff.insertMany(staffs).then(function(){
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
	console.log("downloadStaffExcel");
	 const { company_id  } = req.query;
	  let query={};
	if (company_id == undefined || company_id =="") {
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
  Staff.find( query ).then((objs) => {
    let staffs = [];

    objs.forEach((obj) => {
		
		var str_smartcard_uid=undefined;
		 str_smartcard_uid= JSON.stringify(obj.smartcard_uid);
		str_smartcard_uid=(str_smartcard_uid||'').replaceAll('"','');;
		 
		
      staffs.push({
		  
		  company_name_eng:obj.company_name_eng,
		  company_name_chi:obj.company_name_chi,
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
		  bilibili_url: obj.bilibili_url,
		  qq_url: obj.qq_url,
		  zhihu_url: obj.zhihu_url,
		  app_store_url:obj.app_store_url,
		  google_play_url: obj.google_play_url,
		  snapchat_url:obj.snapchat_url,
		  telegram_url: obj.telegram_url,
		  note: obj.note,
		  note_timestamp: obj.note_timestamp,
		  qrcode_option: obj.qrcode_option,
		  minisite_option: obj.minisite_option,
		  bizcard_option: obj.bizcard_option,
		  dig_card_in_vcf: obj.dig_card_in_vcf,
		  status:obj.status,
         
      });
    });

 
 
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffs");

    worksheet.columns = [
	{ header: "company_name_eng", key: "company_name_eng", width: 25 },
	{ header: "company_name_chi", key: "company_name_chi", width: 25 },
      { header: "first_name", key: "fname", width: 25 },
      { header: "last_name", key: "lname", width: 25 },
	  { header: "middle_name", key: "mname", width: 25 },
      { header: "prefix_name", key: "pname", width: 25 },
	  { header: "other_name", key: "oname", width: 25 },
      { header: "prof_des_name", key: "pdname", width: 25 },
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
	  { header: "bilibili_url", key: "bilibili_url", width: 25 },
	  { header: "qq_url", key: "qq_url", width: 25 },
	  { header: "zhihu_url", key: "zhihu_url", width: 25 },
	  { header: "app_store_url", key: "app_store_url", width: 25 },
	  { header: "google_play_url", key: "google_play_url", width: 25 },
	  { header: "snapchat_url", key: "snapchat_url", width: 25 },
	  { header: "telegram_url", key: "telegram_url", width: 25 },
	  { header: "note", key: "note", width: 25 },
	  { header: "note_timestamp", key: "note_timestamp", width: 25 },
	  { header: "bizcard_option", key: "bizcard_option", width: 25 },
	  { header: "dig_card_in_vcf", key: "dig_card_in_vcf", width: 25 },
	  { header: "qrcode_option", key: "qrcode_option", width: 25 },
	  { header: "minisite_option", key: "minisite_option", width: 25 },
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

exports.downloadStaffLinkExcel =  (req, res) => {
	console.log("downloadStaffLinkExcel");
	 const { company_id  } = req.query;
	  let query={};
	if (company_id == undefined || company_id =="") {
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
  Staff.find( query ).then((objs) => {
    let staffs = [];

    objs.forEach((obj) => {
		 
		var str_smartcard_uid=undefined;
		 str_smartcard_uid= JSON.stringify(obj.smartcard_uid);
		str_smartcard_uid=(str_smartcard_uid||'').replaceAll('"','');;
		let enc_uid=encodeURIComponent(AES_ENCRYPT(obj.id,"12345678123456781234567812345678"));
		let vcf_qrcode_link=global.profileUrl+""+enc_uid+"&qrtype=1";
		let align_with_smartcard_link=global.profileUrl+""+enc_uid;
		let e_profile_link=global.profileUrl+""+enc_uid+"&bo=1";
		let vcf_link=global.profileUrl+""+enc_uid+"&bo=0";
		let google_wallet_link=global.profileUrl+""+enc_uid+"&gengw=1";
		let apple_wallet_link=global.profileUrl+""+enc_uid+"&genaw=1";
		let mobile_site_link=global.profileUrl+""+enc_uid+"&mobilesite=1";
	 
		 
		var staff =  {
		  
		  company_name_eng:obj.company_name_eng,
		  company_name_chi:obj.company_name_chi,
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
		  bilibili_url: obj.bilibili_url,
		  qq_url: obj.qq_url,
		  zhihu_url: obj.zhihu_url,
		  app_store_url:obj.app_store_url,
		  google_play_url: obj.google_play_url,
		  snapchat_url:obj.snapchat_url,
		  telegram_url: obj.telegram_url,
		  note: obj.note,
		  note_timestamp: obj.note_timestamp,
		  smartcard_uid: str_smartcard_uid,
		  qrcode_option: obj.qrcode_option, 
		  minisite_option: obj.minisite_option,
		  bizcard_option: obj.bizcard_option,
		  dig_card_in_vcf: obj.dig_card_in_vcf,
		  status:obj.status,
		  vcf_qrcode_link: vcf_qrcode_link,
		  align_with_smartcard_link: align_with_smartcard_link,
		  e_profile_link:e_profile_link,
		  vcf_link: vcf_link,
		  google_wallet_link: google_wallet_link,
		  apple_wallet_link: apple_wallet_link,
		  mobile_site_link: mobile_site_link,
      } 

	  staffs.push(staff);

    });

 
 
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffs");

    worksheet.columns = [
	{ header: "company_name_eng", key: "company_name_eng", width: 25 },
	{ header: "company_name_chi", key: "company_name_chi", width: 25 },
      { header: "first_name", key: "fname", width: 25 },
      { header: "last_name", key: "lname", width: 25 },
	  { header: "middle_name", key: "mname", width: 25 },
      { header: "prefix_name", key: "pname", width: 25 },
	  { header: "other_name", key: "oname", width: 25 },
      { header: "prof_des_name", key: "pdname", width: 25 },
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
	  { header: "minisite_option", key: "minisite_option", width: 25 },
	  { header: "status", key: "status", width: 25 },
	  { header: "vcf_qrcode_link", key: "vcf_qrcode_link", width: 25 },
	  { header: "align_with_smartcard_link", key: "align_with_smartcard_link", width: 25 },
	  { header: "e_profile_link", key: "e_profile_link", width: 25 },
	  { header: "vcf_link", key: "vcf_link", width: 25 },
	  { header: "google_wallet_link", key: "google_wallet_link", width: 25 },
	  { header: "apple_wallet_link", key: "apple_wallet_link", width: 25 },
	  { header: "mobile_site_link", key: "mobile_site_link", width: 25 },
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
