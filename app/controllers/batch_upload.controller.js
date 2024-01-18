const db = require("../models");
const readXlsxFile = require('read-excel-file/node')
var ObjectId = require('mongodb').ObjectId; 
const excel = require("exceljs");
const Action_log = db.action_log;
const Staff_log = db.staff_log;
const Staff = db.staffs;
const BeaCompanyId="64f37df6528e09409ddab475";
const BeaUid="64f49b8bd7517dffb354c33e";
const CryptoJS = require('crypto-js');
const profileUrl=db.profileUrl;

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
		for (let i = 0; i < 86; i++) {
			  if (row[i]==null || row[i]==undefined)
				  row[i]="";
			} 
		let y=0;	
        var staff = {
		  company_id: company_id,
		  cc_no:row[y++],
		  staff_no:row[y++],
		  status:row[y++],
		  fname: row[y++],
		  title_eng:row[y++],
		  title_eng2:row[y++],
		  dept_eng:row[y++],
		  division_eng:row[y++],
		  lname: row[y++],
		  title_chi:row[y++],
		  title_chi2:row[y++],
		  dept_chi: row[y++],
		  division_chi: row[y++],
		  pro_title:row[y++],
		  field071:row[y++],
		  field066: row[y++],
		  company_name_option:row[y++], 
		  company_name_eng2: row[y++],
		  company_name_chi2: row[y++],
		  field072: row[y++], 
		  field073: row[y++],  
	      company_name_eng3: row[y++],
	      company_name_chi3: row[y++],
          field069: row[y++],
		  field070: row[y++], 
		  hkma_no: row[y++],
		 type1_no: row[y++],
		  type4_no: row[y++],
		  type6_no: row[y++],
		  type9_no: row[y++],
		   mpf_no: row[y++],
		    agent_no: row[y++],
			insurance_no: row[y++],
			 sfc_no: row[y++],
		  sfc_type1_no: row[y++],
		  sfc_type2_no: row[y++],
		   bloomberg_info:row[y++],
		   reuters_code: row[y++],
		   field052: row[y++],
		    field054: row[y++],
			field055: row[y++],
			  field051: row[y++],
		    field053: row[y++],
		   swift_no: row[y++],
		    work_tel: row[y++],
		  work_tel2: row[y++],
		  work_tel3: row[y++],
		  direct_tel: row[y++],
		   mobile: row[y++],
		  mobile2: row[y++],
		  mobile3: row[y++],
		   mobile_china_tel: row[y++],
		  mobile_china_tel2: row[y++],
		  mobile_china_tel3: row[y++],
		  field068: row[y++],
		  work_email: row[y++],
		  work_email2: row[y++],
		  work_email3: row[y++],
		  fax: row[y++],
		  address_eng: row[y++],
		  address_chi: row[y++],
		  address_eng2: row[y++],
		  address_chi2: row[y++],
		  web_link: row[y++],
		   web_link2: row[y++],
		   web_link3: row[y++],
		   bizcard_option: row[y++],
		qrcode_option: row[y++],
		  field056: row[y++],
		  field057: row[y++],
		  field058: row[y++],
		  field059: row[y++],
		  field060: row[y++],
		 field065: row[y++],
		  field067: row[y++],
		   field061: row[y++],
		  field062: row[y++],
		  field063: row[y++],
		  field064: row[y++], 
		 
        };

        staffs.push(staff);
		
      };
	  
	  
	   return staffs;
	   }
	);  
	 
	  for (var s of xls_staffs){
		  var query ={};
		   query.company_id =  ObjectId(company_id);
		   query.staff_no =  s.staff_no;
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
									staff_no: data.staff_no,
									 company_name_option:data.company_name_option,
									 
									company_name_eng2: data.company_name_eng,
									company_name_chi2: data.company_name_chi,
									company_name_eng3: data.company_name_eng,
									company_name_chi3: data.company_name_chi,
									fname: data.fname,
									lname: data.lname,
									  cc_no: data.cc_no,
									  
									  title_eng: data.title_eng,
									  title_chi: data.title_chi,
									    title_eng2: data.title_eng2,
									  title_chi2: data.title_chi2,
									  pro_title: data.pro_title,
									  field071: data.field071,
									  division_eng: data.division_eng,
									  division_chi: data.division_chi,
									  dept_eng: data.dept_eng,
									  dept_chi: data.dept_chi,
									  address_eng: data.address_eng,
									  address_chi: data.address_chi,
									  address_eng2: data.address_eng2,
									  address_chi2: data.address_chi2,
									  work_tel: data.work_tel,
									  work_tel2: data.work_tel2,
									  work_tel3: data.work_tel3,
									  direct_tel: data.direct_tel,
									  
									  mobile: data.mobile,
									  mobile2: data.mobile2,
									  mobile3: data.mobile3,
									  mobile_china_tel: data.mobile_china_tel,
									  mobile_china_tel2: data.mobile_china_tel2,
									  mobile_china_tel3: data.mobile_china_tel3,
									  fax: data.fax,
									  swift_no: data.swift_no,
									  work_email: data.work_email,
									  work_email2: data.work_email2,
									  work_email3: data.work_email2,
									  web_link: data.web_link,
									  
									  web_link2: data.web_link2,
									  
									  web_link3: data.web_link3,
									  
									  agent_no: data.agent_no,
									  insurance_no: data.insurance_no,
									  mpf_no: data.mpf_no,
									  hkma_no: data.hkma_no,
									  type1_no: data.type1_no,
									  type4_no: data.type4_no,
									  type6_no: data.type6_no,
									  type9_no: data.type9_no,
									  reuters_code: data.reuters_code,
									  bloomberg_info: data.bloomberg_info,
									  sfc_no: data.sfc_no,
									  sfc_type1_no: data.sfc_type1_no,
									  sfc_type2_no: data.sfc_type2_no,
									  field051: data.field051,
									  field052: data.field052,
									  field053: data.field053,
									  field054: data.field054,
									  field055: data.field055,
									  field056: data.field056,
									  field057: data.field057,
									  field058: data.field058,
									  field059: data.field059,
									  field060: data.field060,
									  field061: data.field061,
									  field062: data.field062,
									  field063: data.field063,
									  field064: data.field064,
									  field065: data.field065,
									  field066: data.field066,
									  field067: data.field067,
									  field068: data.field068,
									  field069: data.field069,
									  field070: data.field070, 
									  field072: data.field072, 
									  field073: data.field073, 
									  
									  smartcard_uid: data.smartcard_uid,
									  bizcard_option: data.bizcard_option,
									   
									  qrcode_option: data.qrcode_option,
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
			 
			console.log("new doc id");
			
			 // Save Staff in the database
			 var staff=new Staff(s);
			staff.save(s)
				.then(data => {
					
					new_staffs.push(s);
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
												staff_no: data.staff_no,
												company_name_option:data.company_name_option,
											 
												company_name_eng2: data.company_name_eng,
												company_name_chi2: data.company_name_chi,
												company_name_eng3: data.company_name_eng,
												company_name_chi3: data.company_name_chi,
												fname: data.fname,
												lname: data.lname,
												  cc_no: data.cc_no,
												  
												  title_eng: data.title_eng,
												  title_chi: data.title_chi,
												  title_eng2: data.title_eng2,
												  title_chi2: data.title_chi2,
												  pro_title: data.pro_title,
												   field071: data.field071,
												  division_eng: data.division_eng,
												  division_chi: data.division_chi,
												  dept_eng: data.dept_eng,
												  dept_chi: data.dept_chi,
												  address_eng: data.address_eng,
												  address_chi: data.address_chi,
												  address_eng2: data.address_eng2,
												  address_chi2: data.address_chi2,
												  work_tel: data.work_tel,
												  work_tel2: data.work_tel2,
												  work_tel3: data.work_tel3,
												  direct_tel: data.direct_tel,
												 
												  mobile: data.mobile,
												  mobile2: data.mobile2,
												  mobile3: data.mobile3,
												  mobile_china_tel: data.mobile_china_tel,
												  mobile_china_tel2: data.mobile_china_tel2,
												  mobile_china_tel3: data.mobile_china_tel3,
												  fax: data.fax,
												  swift_no: data.swift_no,
												  work_email: data.work_email,
												  work_email2: data.work_email2,
												  work_email3: data.work_email2,
												  web_link: data.web_link,
												   
												  web_link2: data.web_link2,
												 
												  web_link3: data.web_link3,
												 
												  agent_no: data.agent_no,
												  insurance_no: data.insurance_no,
												  mpf_no: data.mpf_no,
												  hkma_no: data.hkma_no,
												  type1_no: data.type1_no,
												  type4_no: data.type4_no,
												  type6_no: data.type6_no,
												   type9_no: data.type9_no,
												  reuters_code: data.reuters_code,
												  bloomberg_info: data.bloomberg_info,
												  sfc_no: data.sfc_no,
												   sfc_type1_no: data.sfc_type1_no,
												  sfc_type2_no: data.sfc_type2_no,
												  field051: data.field051,
												  field052: data.field052,
												  field053: data.field053,
												  field054: data.field054,
												  field055: data.field055,
												  field056: data.field056,
												  field057: data.field057,
												  field058: data.field058,
												  field059: data.field059,
												  field060: data.field060,
												  field061: data.field061,
												  field062: data.field062,
												  field063: data.field063,
												  field064: data.field064,
												  field065: data.field065,
												  field066: data.field066,
												  field067: data.field067,
												  field068: data.field068,
												  field069: data.field069,
												  field070: data.field070, 
												   field072: data.field072, 
												   field073: data.field073, 
												  smartcard_uid: data.smartcard_uid,
												  bizcard_option: data.bizcard_option,
												  
												  qrcode_option: data.qrcode_option,
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
       let y=0;	
        var staff = {
			 company_id: company_id,
		    staff_no:row[y++],
			  company_name_option:row[y++],
		 
		  company_name_eng2: row[y++],
		  company_name_chi2: row[y++],
	      company_name_eng3: row[y++],
	      company_name_chi3: row[y++],
		 
		   cc_no:row[y++],
		
          fname: row[y++],
		  lname: row[y++],
		  title_eng:row[y++],
		  title_chi:row[y++],
		   title_eng2:row[y++],
		  title_chi2:row[y++],
		  pro_title:row[y++],
		  field071:row[y++],
		    division_eng:row[y++],
		  division_chi: row[y++],
		  dept_eng:row[y++],
		  dept_chi: row[y++],
		  address_eng: row[y++],
		  address_chi: row[y++],
		  address_eng2: row[y++],
		  address_chi2: row[y++],
		  work_tel: row[y++],
		  work_tel2: row[y++],
		  work_tel3: row[y++],
		  direct_tel: row[y++],
		  direct_tel2: row[y++],
		  direct_tel3: row[y++],
		  mobile: row[y++],
		  mobile2: row[y++],
		  mobile3: row[y++],
		  mobile_china_tel: row[y++],
		  mobile_china_tel2: row[y++],
		  mobile_china_tel3: row[y++],
		  fax: row[y++],
		  swift_no: row[y++],
		  work_email: row[y++],
		  work_email2: row[y++],
		  work_email3: row[y++],
		  web_link: row[y++],
		  web_link2: row[y++],
		  web_link3: row[y++],
		  web_link_label: row[y++],
		  web_link_label2: row[y++],
		  web_link_label3: row[y++],
		  agent_no: row[y++],
		  insurance_no: row[y++],
		  mpf_no: row[y++],
		  hkma_no: row[y++],
		  type1_no: row[y++],
		  type4_no: row[y++],
		  type6_no: row[y++],
		  type9_no: row[y++],
		  reuters_code: row[y++],
		  bloomberg_info:row[y++],
		  sfc_no: row[y++],
		   sfc_type1_no: row[y++],
		  sfc_type2_no: row[y++],
		  field051: row[y++],
		  field052: row[y++],
		  field053: row[y++],
		  field054: row[y++],
		  field055: row[y++],
		  field056: row[y++],
		  field057: row[y++],
		  field058: row[y++],
		  field059: row[y++],
		  field060: row[y++],
		  field061: row[y++],
		  field062: row[y++],
		  field063: row[y++],
		  field064: row[y++],
		  field065: row[y++],
		  field066: row[y++],
		  field067: row[y++],
		  field068: row[y++],
		  field069: row[y++],
		  field070: row[y++], 
		  field072: row[y++],
		  field073: row[y++],
		  additional_info: row[y++], 
		 
		  bizcard_option: row[y++],
		  
		  qrcode_option: row[y++],
		  status:row[y++],
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
  Staff.find( query ).sort({_id:-1}).limit(3500).then((objs) => {
    let staffs = [];

    objs.forEach((data) => {
		
		var str_smartcard_uid=undefined;
		 str_smartcard_uid= JSON.stringify(data.smartcard_uid);
		str_smartcard_uid=(str_smartcard_uid||'').replaceAll('"','');;
		 
		
      staffs.push({
		  
								staff_no: data.staff_no,
								 company_name_option:data.company_name_option,
								 
									company_name_eng2: data.company_name_eng2,
									company_name_chi2: data.company_name_chi2,
									company_name_eng3: data.company_name_eng3,
									company_name_chi3: data.company_name_chi3,
									 cc_no: data.cc_no,
									 
									  fname: data.fname,
									lname: data.lname,
									 
									  title_eng: data.title_eng,
									  title_chi: data.title_chi,
									  title_eng2: data.title_eng2,
									  title_chi2: data.title_chi2,
									  pro_title: data.pro_title,
									  field071: data.field071,
									  division_eng: data.division_eng,
									  division_chi: data.division_chi,
									  dept_eng: data.dept_eng,
									  dept_chi: data.dept_chi,
									  address_eng: data.address_eng,
									  address_chi: data.address_chi,
									  address_eng2: data.address_eng2,
									  address_chi2: data.address_chi2,
									  work_tel: data.work_tel,
									  work_tel2: data.work_tel2,
									  work_tel3: data.work_tel3,
									  direct_tel: data.direct_tel,
									  
									  mobile: data.mobile,
									  mobile2: data.mobile2,
									  mobile3: data.mobile3,
									  mobile_china_tel: data.mobile_china_tel,
									  mobile_china_tel2: data.mobile_china_tel2,
									  mobile_china_tel3: data.mobile_china_tel3,
									  fax: data.fax,
									  swift_no: data.swift_no,
									  work_email: data.work_email,
									  work_email2: data.work_email2,
									  work_email3: data.work_email2,
									  web_link: data.web_link,
									 
									  web_link2: data.web_link2,
									  
									  web_link3: data.web_link3,
									 
									  agent_no: data.agent_no,
									  insurance_no: data.insurance_no,
									  mpf_no: data.mpf_no,
									  hkma_no: data.hkma_no,
									  type1_no: data.type1_no,
									  type4_no: data.type4_no,
									  type6_no: data.type6_no,
									  type9_no: data.type9_no,
									  reuters_code: data.reuters_code,
									  bloomberg_info: data.bloomberg_info,
									  sfc_no: data.sfc_no,
									   sfc_type1_no: data.sfc_type1_no,
									  sfc_type2_no: data.sfc_type2_no,
									  field051: data.field051,
									  field052: data.field052,
									  field053: data.field053,
									  field054: data.field054,
									  field055: data.field055,
									  field056: data.field056,
									  field057: data.field057,
									  field058: data.field058,
									  field059: data.field059,
									  field060: data.field060,
									  field061: data.field061,
									  field062: data.field062,
									  field063: data.field063,
									  field064: data.field064,
									  field065: data.field065,
									  field066: data.field066,
									  field067: data.field067,
									  field068: data.field068,
									  field069: data.field069,
									  field070: data.field070, 
									  field072: data.field072, 
									  field073: data.field073, 
									  
												  smartcard_uid: data.smartcard_uid,
												  bizcard_option: data.bizcard_option,
												  
												  qrcode_option: data.qrcode_option,
												  profile_counter: data.profile_counter,
												  vcf_counter: data.vcf_counter,
												 
												  status: data.status, 
         
      });
    });

 
 
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffs2023");

    worksheet.columns = [
	{ header: "Charging_Centre (Affiliate Code)", key: "cc_no", width: 25 },
	{ header: "Application_ID", key: "staff_no", width: 25 },
	{ header: "TRUE (Add_Amend) FALSE (Inactive)", key: "status", width: 25 },
	{ header: "Name (Eng)", key: "fname", width: 25 },
	{ header: "Job Title (Line 1)", key: "title_eng", width: 25 },
	{ header: "Job Title (Line 2)", key: "title_eng2", width: 25 },
	{ header: "Department_Branch Name", key: "dept_eng", width: 25 },
	{ header: "Division Name", key: "division_eng", width: 25 },
	{ header: "Name (Chi)", key: "lname", width: 25 },
	{ header: "Job Title (Line 1) (Chi)", key: "title_chi", width: 25 },
    { header: "Job Title (Line 2) (Chi)", key: "title_chi2", width: 25 },
	{ header: "Department_Branch Name (Chi)", key: "dept_chi", width: 25 },
	{ header: "Division Name (Chi)", key: "division_chi", width: 25 },
	{ header: "Professional designation (Line 1)", key: "pro_title", width: 25 },
	{ header: "Professional designation (Line 2)", key: "field071", width: 25 },
	{ header: "Additional Title", key: "field066", width: 25 },
	{ header: "Company Name 0_(The Bank of East Asia Limited) 1_(Bank of East Asia (Trustees) Limited) 2_(East Asia Futures Limited) 3_(East Asia Property Agency Company Limited) 4_(East Asia Facility Management Limited) 5_(East Asia Securities Company Limited) 6_(BEA Insurance Agency Limited)", key: "company_name_option", width: 25 },
 	{ header: "2nd Company Name", key: "company_name_eng2", width: 25 },
	{ header: "2nd Company Name (Chi)", key: "company_name_chi2", width: 25 },
	 { header: "2nd Company title", key: "field072", width: 25 },
	{ header: "2nd Company title (Chi)", key: "field073", width: 25 },
	{ header: "3rd Company Name", key: "company_name_eng3", width: 25 },
	{ header: "3rd Company Name (Chi)", key: "company_name_chi3", width: 25 },
    { header: "3rd Company title", key: "field069", width: 25 },
	  { header: "3rd Company title (Chi)", key: "field070", width: 25 },
	  { header: "HKMA Reg_No", key: "hkma_no", width: 25 },
	  { header: "HKMA Type 1_Dealing in Securities (True_Yes  False_No)", key: "type1_no", width: 25 },
	  { header: "HKMA Type 4_Advising on Securities (True_Yes  False_No)", key: "type4_no", width: 25 },
	  { header: "HKMA Type 6_Advising on Corporate Finance (True_Yes  False_No)", key: "type6_no", width: 25 },
	  { header: "HKMA Type 9_Asset Management (True_Yes  False_No)", key: "type9_no", width: 25 },
	  { header: "MPF Intermediary Reg_No", key: "mpf_no", width: 25 },
	  { header: "Technical Representative (Agent) Licence No", key: "agent_no", width: 25 },
	  { header: "Insurance Agent Licence No.", key: "insurance_no", width: 25 },
	  { header: "SFC Central Entity No", key: "sfc_no", width: 25 },
	  { header: "SFC Type 1_Dealing in Securities (True_Yes  False_No)", key: "sfc_type1_no", width: 25 },
	  { header: "SFC Type 2_Dealing in Futures Contracts (True_Yes  False_No)", key: "sfc_type2_no", width: 25 },
	  { header: "Bloomberg", key: "bloomberg_info", width: 25 },
	  { header: "Reuters Dealing Code", key: "reuters_code", width: 25 },
	  { header: "Estate Agent Licence (Individual) Licence No", key: "field052", width: 25 },
	  { header: "Property Management Practitioner (Tier 1) Licence Licence No", key: "field054", width: 25 },
	  { header: "Property Management Practitioner (Tier 2) Licence Licence No", key: "field055", width: 25 },
	  { header: "Estate Agent Licence (Company) Licence No", key: "field051", width: 25 },
	  { header: "Property Management Company Licence Licence No", key: "field053", width: 25 },
	  { header: "SWIFT Code", key: "swift_no", width: 25 },
	  { header: "Work Tel_1", key: "work_tel", width: 25 },
	  { header: "Work Tel_2", key: "work_tel2", width: 25 },
	  { header: "Work Tel_3", key: "work_tel3", width: 25 },
	  { header: "Direct Line", key: "direct_tel", width: 25 },
	  { header: "Mobile_1", key: "mobile", width: 25 },
	  { header: "Mobile_2", key: "mobile2", width: 25 },
	  { header: "Mobile_3", key: "mobile3", width: 25 },
	  { header: "China Mobile_1", key: "mobile_china_tel", width: 25 },
	  { header: "China Mobile_2", key: "mobile_china_tel2", width: 25 },
	  { header: "China Mobile_3", key: "mobile_china_tel3", width: 25 },
	  { header: "Merchant Services Hotline_Tel", key: "field068", width: 25 },
	  { header: "Work Email_1", key: "work_email", width: 25 },
	  { header: "Work Email_2", key: "work_email2", width: 25 },
	  { header: "Work Email_3", key: "work_email3", width: 25 },
	  { header: "Facsimile (852)", key: "fax", width: 25 },
	  { header: "Address", key: "address_eng", width: 25 },
	  { header: "Address (Chi)", key: "address_chi", width: 25 },
	  { header: "2nd Address", key: "address_eng2", width: 25 },
	  { header: "2nd Address (Chi)", key: "address_chi2", width: 25 }, 
	  { header: "Website_1", key: "web_link", width: 25 },
      { header: "Website_2", key: "web_link2", width: 25 },
	  { header: "Website_3", key: "web_link3", width: 25 },
	  { header: "Smart Card Option (True_eprofile  False_vcf)", key: "bizcard_option", width: 25 },
	  { header: "QR Code on E-Profile (1_Vcard  2_Align with Card 3_E-Profile 4_VCF)", key: "qrcode_option", width: 25 },
	  { header: "Reserved Field under HKMA Reg No", key: "field056", width: 25 },
	  { header: "Reserved Field under HKMA Reg No", key: "field057", width: 25 },
	  { header: "Reserved Field under HKMA Reg No", key: "field058", width: 25 },
	  { header: "SFC Type 4_Advising on Securities (True_Yes  False_No)", key: "field059", width: 25 },
	  { header: "Reserved Field under SFC Central Entity No", key: "field060", width: 25 },
	  { header: "Reserved Field at the bottom of ABOUT ME page", key: "field065", width: 25 }, 
	  { header: "Reserved Field at the bottom of GET IN TOUCH Page", key: "field067", width: 25 },
	    { header: "Reserved Field at the bottom of Staff Profile", key: "field061", width: 25 },
	  { header: "Reserved Field at the bottom of Staff Profile", key: "field062", width: 25 },
	  { header: "Reserved Field at the bottom of Staff Profile", key: "field063", width: 25 },
	  { header: "Reserved Field at the bottom of Staff Profile", key: "field064", width: 25 }, 
    ];

    // Add Array Rows
    worksheet.addRows(staffs);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "staffs2023.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};


exports.uploadStaffJson =  async (req, res) => {
	 
	 
 function renameKey ( obj, oldKey, newKey ) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}


   var requestIP = req.header('x-forwarded-for');
	console.log('ip');
	console.log(requestIP);
    if(global.trustedIps.indexOf(requestIP) >= 0) {
        // do stuff
  
 try{
	 //console.log(req.body[0]); 
	 console.log("count of staff records:");
	 console.log(Object.keys(req.body).length);
	 let total_of_records= Object.keys(req.body).length;
	  var staffs = [];
	 var xls_staffs = [];
    var new_staffs = [];
	    var old_staffs = [];
	  
	  
		console.log("-=------------req body start---------=");
		console.log(req.body); 
		console.log("-=------------req body end---------=");
		 // convert req json body to staff Array
		 
		 req.body.forEach( obj => renameKey( obj, 'name_eng', 'fname' ) );
		req.body.forEach( obj => renameKey( obj, 'name_chi', 'lname' ) );
		req.body.forEach( obj => renameKey( obj, 'estate_agent_company_no', 'field051' ) );
		req.body.forEach( obj => renameKey( obj, 'estate_agent_individual_no', 'field052' ) );
		
		req.body.forEach( obj => renameKey( obj, 'property_management_company_no', 'field053' ) );
		req.body.forEach( obj => renameKey( obj, 'property_tier1_no', 'field054' ) );
		req.body.forEach( obj => renameKey( obj, 'property_tier2_no', 'field055' ) );
		 
		req.body.forEach( obj => renameKey( obj, 'additional_info', 'field056' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info2', 'field057' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info3', 'field058' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info4', 'field059' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info5', 'field060' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info6', 'field061' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info7', 'field062' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info8', 'field063' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info9', 'field064' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info10', 'field065' ) );
		req.body.forEach( obj => renameKey( obj, 'special_title', 'field066' ) );
		req.body.forEach( obj => renameKey( obj, 'additional_info12', 'field067' ) );
		req.body.forEach( obj => renameKey( obj, 'mshotline_tel', 'field068' ) );
		req.body.forEach( obj => renameKey( obj, 'company3_position', 'field069' ) );
		req.body.forEach( obj => renameKey( obj, 'company3_position2', 'field070' ) );
		req.body.forEach( obj => renameKey( obj, 'pro_title2', 'field071' ) );
		req.body.forEach( obj => renameKey( obj, 'company2_position', 'field072' ) );
		req.body.forEach( obj => renameKey( obj, 'company2_position2', 'field073' ) );
		const updatedJson = req.body;
		 // convert req json body to staff Array
		 
		console.log("-=------------req body start converted---------=");
		//console.log(updatedJson); 
		console.log("-=------------req body end converted---------=");
	for ( i in req.body ){
		  var query ={};
		   query.company_id =  ObjectId(BeaCompanyId);
		   query.staff_no =  req.body[i].staff_no;
		   req.body[i].updatedAt = Date.now();
		   req.body[i].company_id =  ObjectId(BeaCompanyId);
		let mongoDocument =  await Staff.findOne(query).exec();
		var s=req.body[i];
		
		if (mongoDocument!=undefined)
		{
		s.profile_url=global.profileUrl+""+encodeURIComponent(AES_ENCRYPT(mongoDocument.id,"12345678123456781234567812345678"));
		
			old_staffs.push(s);
			console.log("old doc id"+mongoDocument.id);
			
			//batch update excel staff one by one
			await Staff.findByIdAndUpdate(mongoDocument.id, s, {new: true, useFindAndModify: true })
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
							createdBy: data.createdBy,
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
								 
								console.log(data.id);
								staff_log = new Staff_log({
									action_log_id: ObjectId(data2.id),
									staff_id: ObjectId(data._id),
									udid:data.udid,
									
									company_id: data.company_id,
									staff_no: data.staff_no,
									 company_name_option:data.company_name_option,
									 
									company_name_eng2: data.company_name_eng,
									company_name_chi2: data.company_name_chi,
									company_name_eng3: data.company_name_eng,
									company_name_chi3: data.company_name_chi,
									fname: data.fname,
									lname: data.lname,
									  cc_no: data.cc_no,
									  
									  title_eng: data.title_eng,
									  title_chi: data.title_chi,
									    title_eng2: data.title_eng2,
									  title_chi2: data.title_chi2,
									  pro_title: data.pro_title,
									  field071: data.field071,
									  division_eng: data.division_eng,
									  division_chi: data.division_chi,
									  dept_eng: data.dept_eng,
									  dept_chi: data.dept_chi,
									  address_eng: data.address_eng,
									  address_chi: data.address_chi,
									  address_eng2: data.address_eng2,
									  address_chi2: data.address_chi2,
									  work_tel: data.work_tel,
									  work_tel2: data.work_tel2,
									  work_tel3: data.work_tel3,
									  direct_tel: data.direct_tel,
						 
									  mobile: data.mobile,
									  mobile2: data.mobile2,
									  mobile3: data.mobile3,
									  mobile_china_tel: data.mobile_china_tel,
									  mobile_china_tel2: data.mobile_china_tel2,
									  mobile_china_tel3: data.mobile_china_tel3,
									  fax: data.fax,
									  swift_no: data.swift_no,
									  work_email: data.work_email,
									  work_email2: data.work_email2,
									  work_email3: data.work_email2,
									  web_link: data.web_link,
									   web_link2: data.web_link2,
									   web_link3: data.web_link3,
									  
									  agent_no: data.agent_no,
									  insurance_no: data.insurance_no,
									  mpf_no: data.mpf_no,
									  hkma_no: data.hkma_no,
									  type1_no: data.type1_no,
									  type4_no: data.type4_no,
									  type6_no: data.type6_no,
									  type9_no: data.type9_no,
									  reuters_code: data.reuters_code,
									  bloomberg_info: data.bloomberg_info,
									  sfc_no: data.sfc_no,
									  sfc_type1_no: data.sfc_type1_no,
									  sfc_type2_no: data.sfc_type2_no,
									  field051: data.field051,
									  field052: data.field052,
									  field053: data.field053,
									  field054: data.field054,
									  field055: data.field055,
									  field056: data.field056,
									  field057: data.field057,
									  field058: data.field058,
									  field059: data.field059,
									  field060: data.field060,
									  field061: data.field061,
									  field062: data.field062,
									  field063: data.field063,
									  field064: data.field064,
									  field065: data.field065,
									  field066: data.field066,
									  field067: data.field067,
									  field068: data.field068,
									  field069: data.field069,
									  field070: data.field070, 
									 field072: data.field072, 
									 field073: data.field073,  
									  smartcard_uid: data.smartcard_uid,
									  bizcard_option: data.bizcard_option,
									  qrcode_option: data.qrcode_option,
									  profile_counter: data.profile_counter,
									  vcf_counter: data.vcf_counter,
									  status: data.status, 
									  updatedBy: ObjectId(BeaUid), 
									  createdBy: data.createdBy, 
									  createdAt: data.createdAt, 
									  updatedAt: Date.now(),
									  profile_url: global.profileUrl+""+encodeURIComponent(AES_ENCRYPT(data.id,"12345678123456781234567812345678")),
								});
								  
								staff_log.save(staff_log);
							//backup old staff records to table staff_logs
							}
						});
						 //white action log before send successful
					}
			});
		}else{
			 
		
			
			
			 // Save Staff in the database
			 var staff=new Staff(s);
			await staff.save(s)
				.then(data => {
					console.log("new doc id"+data.id);
					console.log("under new staff save function");
					
					 s.profile_url=global.profileUrl+""+encodeURIComponent(AES_ENCRYPT(data.id,"12345678123456781234567812345678"));
				 
					 new_staffs.push(s);
					 
					//console.log(s);
					
					console.log("under new staff save function");
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
												staff_no: data.staff_no,
												company_name_option:data.company_name_option,
											 
												company_name_eng2: data.company_name_eng,
												company_name_chi2: data.company_name_chi,
												company_name_eng3: data.company_name_eng,
												company_name_chi3: data.company_name_chi,
												fname: data.fname,
												lname: data.lname,
												  cc_no: data.cc_no,
												  
												  title_eng: data.title_eng,
												  title_chi: data.title_chi,
												  title_eng2: data.title_eng2,
												  title_chi2: data.title_chi2,
												  pro_title: data.pro_title,
												  field071: data.field071,
												  division_eng: data.division_eng,
												  division_chi: data.division_chi,
												  dept_eng: data.dept_eng,
												  dept_chi: data.dept_chi,
												  address_eng: data.address_eng,
												  address_chi: data.address_chi,
												  address_eng2: data.address_eng2,
												  address_chi2: data.address_chi2,
												  work_tel: data.work_tel,
												  work_tel2: data.work_tel2,
												  work_tel3: data.work_tel3,
												  direct_tel: data.direct_tel,
												  
												  mobile: data.mobile,
												  mobile2: data.mobile2,
												  mobile3: data.mobile3,
												  mobile_china_tel: data.mobile_china_tel,
												  mobile_china_tel2: data.mobile_china_tel2,
												  mobile_china_tel3: data.mobile_china_tel3,
												  fax: data.fax,
												  swift_no: data.swift_no,
												  work_email: data.work_email,
												  work_email2: data.work_email2,
												  work_email3: data.work_email2,
												  web_link: data.web_link,
												 
												  web_link2: data.web_link2,
												 
												  web_link3: data.web_link3,
											 
												  agent_no: data.agent_no,
												  insurance_no: data.insurance_no,
												  mpf_no: data.mpf_no,
												  hkma_no: data.hkma_no,
												  type1_no: data.type1_no,
												  type4_no: data.type4_no,
												  type6_no: data.type6_no,
												   type9_no: data.type9_no,
												  reuters_code: data.reuters_code,
												  bloomberg_info: data.bloomberg_info,
												  sfc_no: data.sfc_no,
												   sfc_type1_no: data.sfc_type1_no,
												  sfc_type2_no: data.sfc_type2_no,
												  field051: data.field051,
												  field052: data.field052,
												  field053: data.field053,
												  field054: data.field054,
												  field055: data.field055,
												  field056: data.field056,
												  field057: data.field057,
												  field058: data.field058,
												  field059: data.field059,
												  field060: data.field060,
												  field061: data.field061,
												  field062: data.field062,
												  field063: data.field063,
												  field064: data.field064,
												  field065: data.field065,
												  field066: data.field066,
												  field067: data.field067,
												  field068: data.field068,
												  field069: data.field069,
												  field070: data.field070, 
												  field072: data.field072, 
												  field073: data.field073, 
												  smartcard_uid: data.smartcard_uid,
												  bizcard_option: data.bizcard_option,
												  
												  qrcode_option: data.qrcode_option,
												  profile_counter: data.profile_counter,
												  vcf_counter: data.vcf_counter,
												 
												  status: data.status, 
												  updatedBy: ObjectId(BeaUid), 
												  createdBy: data.createdBy, 
												  createdAt: data.createdAt, 
												  updatedAt: Date.now(),
												  profile_url: global.profileUrl+""+encodeURIComponent(AES_ENCRYPT(data.id,"12345678123456781234567812345678")),
											});
											console.log("copy staff_log");
											 // console.log(staff_log);
											staff_log.save(staff_log);
										
										//backup old staff records to table staff_logs
										}
										});
				 
				}) 
		}
	  }
	console.log(new_staffs);
	console.log("new"+new_staffs.length);
	console.log("old"+old_staffs.length);
	  	  res.send({message: "done",old_staffs,new_staffs});
   
   
   
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the json file: ",
    });
  }
    } else {
        // handle unallowed ip
		res.status(500).send({
			message: "Could not upload the json file: ip not allowed ",
		});
    }
};


exports.downloadStaffJson =  (req, res) => {
	console.log("downloadStaffJson");
		  
    var requestIP = req.header('x-forwarded-for');
	console.log("requestIp"+requestIP);
    if(global.trustedIps.indexOf(requestIP) >= 0) {
        // do stuff
	const { company_id  } = req.query;
	let query={};
	//if (company_id == undefined || company_id =="") {
	//	  return res.status(400).send("ERROR");
	//}
	 
	if (company_id!="63142fd5b54bdbb18f556016")
	{
		//hardcode for bea
		query.company_id = ObjectId(BeaCompanyId);
		console.log("non nfc");
	}else{
		 console.log("nfc");
	}
	 
	 console.log(query);
  Staff.find( query ).then((objs) => {
    let staffs = [];

    objs.forEach((data) => {
		
		var str_smartcard_uid=undefined;
		 str_smartcard_uid= JSON.stringify(data.smartcard_uid);
		str_smartcard_uid=(str_smartcard_uid||'').replaceAll('"','');;
		 
		
      staffs.push({
		  cc_no: data.cc_no,
		  staff_no: data.staff_no,
			status: data.status,						 
					  name_eng: data.fname,
									name_chi: data.lname,	
								pro_title: data.pro_title,		
								  pro_title2: data.field071,	
								 title_eng: data.title_eng,
									  title_chi: data.title_chi,
									  title_eng2: data.title_eng2,
									  title_chi2: data.title_chi2,  
									  special_title: data.field066,
									    dept_eng: data.dept_eng,
									  dept_chi: data.dept_chi,
									   division_eng: data.division_eng,
									  division_chi: data.division_chi,
								 company_name_option:data.company_name_option, 
									company_name_eng2: data.company_name_eng2,
									company_name_chi2: data.company_name_chi2,
									company2_position: data.field072, 
									company2_position2: data.field073,  
									company_name_eng3: data.company_name_eng3,
									company_name_chi3: data.company_name_chi3,
									 company3_position: data.field069,
									 company3_position2: data.field070, 
									 hkma_no: data.hkma_no,
									 type1_no: data.type1_no,
									  type4_no: data.type4_no,
									  type6_no: data.type6_no,
									  type9_no: data.type9_no,
									   mpf_no: data.mpf_no,
									   agent_no: data.agent_no,
									   insurance_no: data.insurance_no,
									    sfc_no: data.sfc_no,
									   sfc_type1_no: data.sfc_type1_no,
									  sfc_type2_no: data.sfc_type2_no,
									  bloomberg_info: data.bloomberg_info,
									   reuters_code: data.reuters_code,
									    estate_agent_individual_no: data.field052,
										property_tier1_no: data.field054,
										 property_tier2_no: data.field055,
										estate_agent_company_no: data.field051, 
									  property_management_company_no: data.field053,
									  swift_no: data.swift_no,
									  work_tel: data.work_tel,
									  work_tel2: data.work_tel2,
									  work_tel3: data.work_tel3,
									  direct_tel: data.direct_tel,
									   mobile: data.mobile,
									  mobile2: data.mobile2,
									  mobile3: data.mobile3,
									  mobile_china_tel: data.mobile_china_tel,
									  mobile_china_tel2: data.mobile_china_tel2,
									  mobile_china_tel3: data.mobile_china_tel3,
									  mshotline_tel: data.field068,
									  work_email: data.work_email,
									  work_email2: data.work_email2,
									  work_email3: data.work_email2,
									  fax: data.fax, 
									  address_eng: data.address_eng,
									  address_chi: data.address_chi,
									  address_eng2: data.address_eng2,
									  address_chi2: data.address_chi2, 
									  web_link: data.web_link,
									  web_link2: data.web_link2,
									  web_link3: data.web_link3,
									  bizcard_option: data.bizcard_option,
									  qrcode_option: data.qrcode_option,
									  additional_info: data.field056,
									  additional_info2: data.field057,
									  additional_info3: data.field058,
									  additional_info4: data.field059,
									  additional_info5: data.field060,
									  additional_info6: data.field061,
									  additional_info7: data.field062,
									  additional_info8: data.field063,
									  additional_info9: data.field064, 
									  additional_info10: data.field065,
									  additional_info12: data.field067, 
									 profile_url: global.profileUrl+""+encodeURIComponent(AES_ENCRYPT(data.id,"12345678123456781234567812345678")),
         
      });
    });

 
   
    
     res.send({message: "done",staffs});
 
  });
     } else {
        // handle unallowed ip
		res.status(500).send({
			message: "Could not upload the json file: ip not allowed ",
		});
    }
};
