const db = require("../models");
const readXlsxFile = require('read-excel-file/node')
var ObjectId = require('mongodb').ObjectId; 
const excel = require("exceljs");
const Action_log = db.action_log;
const Staff_log = db.staff_log;
const Staff = db.staffs;
const BeaCompanyId="64f37df6528e09409ddab475";
const BeaUid="64f49b8bd7517dffb354c33e";

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
		  pro_title2:row[y++],
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
		  web_link_label: row[y++],
		  web_link2: row[y++],
		  web_link_label2: row[y++],
		  web_link3: row[y++],
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
									  pro_title2: data.field071,
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
									  direct_tel2: data.direct_tel2,
									  direct_tel3: data.direct_tel3,
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
									  web_link_label: data.web_link_label,
									  web_link2: data.web_link2,
									  web_link_label2: data.web_link_label2,
									  web_link3: data.web_link3,
									  web_link_label3: data.web_link_label3,
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
												   pro_title2: data.field071,
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
												  direct_tel2: data.direct_tel2,
												  direct_tel3: data.direct_tel3,
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
												   web_link_label: data.web_link_label,
												  web_link2: data.web_link2,
												  web_link_label2: data.web_link_label2,
												  web_link3: data.web_link3,
												  web_link_label3: data.web_link_label3,
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
  Staff.find( query ).then((objs) => {
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
									  pro_title2: data.field071,
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
									  direct_tel2: data.direct_tel2,
									  direct_tel3: data.direct_tel3,
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
									  web_link_label: data.web_link_label,
									  web_link2: data.web_link2,
									  web_link_label2: data.web_link_label2,
									  web_link3: data.web_link3,
									  web_link_label3: data.web_link_label3,
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
									  
												  smartcard_uid: data.smartcard_uid,
												  bizcard_option: data.bizcard_option,
												  
												  qrcode_option: data.qrcode_option,
												  profile_counter: data.profile_counter,
												  vcf_counter: data.vcf_counter,
												 
												  status: data.status, 
         
      });
    });

 
 
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffs");

    worksheet.columns = [
	{ header: "app_id", key: "staff_no", width: 25 },
	{ header: "company_name_option", key: "company_name_option", width: 25 },
 
	{ header: "company_name_eng2", key: "company_name_eng2", width: 25 },
	{ header: "company_name_chi2", key: "company_name_chi2", width: 25 },
	{ header: "company_name_eng3", key: "company_name_eng3", width: 25 },
	{ header: "company_name_chi3", key: "company_name_chi3", width: 25 },
 
      { header: "cc_no", key: "cc_no", width: 25 },
      
	  { header: "name_eng", key: "fname", width: 25 },
      { header: "name_chi", key: "lname", width: 25 },
      { header: "title_eng", key: "title_eng", width: 25 },
	  { header: "title_chi", key: "title_chi", width: 25 },
	  { header: "title_eng2", key: "title_eng2", width: 25 },
	  { header: "title_chi2", key: "title_chi2", width: 25 },
	  { header: "pro_title", key: "pro_title", width: 25 },
	  { header: "pro_title2", key: "pro_title2", width: 25 },
      { header: "division_eng", key: "division_eng", width: 25 },
	  { header: "division_chi", key: "division_chi", width: 25 },
	  { header: "dept_eng", key: "dept_eng", width: 25 },
	  { header: "dept_chi", key: "dept_chi", width: 25 },
	  { header: "address_eng", key: "address_eng", width: 25 },
	  { header: "address_chi", key: "address_chi", width: 25 },
	  { header: "address_eng2", key: "address_eng2", width: 25 },
	  { header: "address_chi2", key: "address_chi2", width: 25 },
	  { header: "work_tel", key: "work_tel", width: 25 },
	  { header: "work_tel2", key: "work_tel2", width: 25 },
	  { header: "work_tel3", key: "work_tel3", width: 25 },
	  { header: "direct_tel", key: "direct_tel", width: 25 },
	  { header: "direct_tel2", key: "direct_tel2", width: 25 },
	  { header: "direct_tel3", key: "direct_tel3", width: 25 },
	  { header: "mobile_tel", key: "mobile_tel", width: 25 },
	  { header: "mobile_tel2", key: "mobile_tel2", width: 25 },
	  { header: "mobile_tel3", key: "mobile_tel3", width: 25 },
	  { header: "mobile_china_tel", key: "mobile_china_tel", width: 25 },
	  { header: "mobile_china_tel2", key: "mobile_china_tel2", width: 25 },
	  { header: "mobile_china_tel3", key: "mobile_china_tel3", width: 25 },
	  { header: "fax_no", key: "fax_no", width: 25 },
	  { header: "swift_no", key: "swift_no", width: 25 },
	  { header: "work_email", key: "work_email", width: 25 },
	  { header: "work_email2", key: "work_email2", width: 25 },
	  { header: "work_email3", key: "work_email3", width: 25 },
	  { header: "website", key: "web_link", width: 25 },
	  { header: "website_title", key: "web_link_label", width: 25 },
	  { header: "website2", key: "web_link2", width: 25 },
	  { header: "website_title2", key: "web_link_label2", width: 25 },
	  { header: "website3", key: "web_link3", width: 25 },
	 { header: "website_title3", key: "web_link_label3", width: 25 },
	  { header: "agent_no", key: "agent_no", width: 25 },
	  { header: "insurance_no", key: "insurance_no", width: 25 },
	  { header: "mpf_no", key: "mpf_no", width: 25 },
	  { header: "hkma_no", key: "hkma_no", width: 25 },
	  { header: "hkma_type1_no", key: "type1_no", width: 25 },
	  { header: "hkma_type4_no", key: "type4_no", width: 25 },
	  { header: "hkma_type6_no", key: "type6_no", width: 25 },
	    { header: "hkma_type9_no", key: "type9_no", width: 25 },
	  { header: "reuters_code", key: "reuters_code", width: 25 },
	  { header: "bloomberg_info", key: "bloomberg_info", width: 25 },
	  { header: "sfc_no", key: "sfc_no", width: 25 },
	  { header: "sfc_type1_no", key: "sfc_type1_no", width: 25 },
	  { header: "sfc_type2_no", key: "sfc_type2_no", width: 25 },
	  { header: "estate_agent_company_no", key: "field051", width: 25 },
	  { header: "estate_agent_individual_no", key: "field052", width: 25 },
	  { header: "property_management_company_no", key: "field053", width: 25 },
	  { header: "property_tier1_no", key: "field054", width: 25 },
	  { header: "property_tier2_no", key: "field055", width: 25 },
	  { header: "additional_info", key: "field056", width: 25 },
	  { header: "additional_info2", key: "field057", width: 25 },
	  { header: "additional_info3", key: "field058", width: 25 },
	  { header: "additional_info4", key: "field059", width: 25 },
	  { header: "additional_info5", key: "field060", width: 25 },
	  { header: "additional_info6", key: "field061", width: 25 },
	  { header: "additional_info7", key: "field062", width: 25 },
	  { header: "additional_info8", key: "field063", width: 25 },
	  { header: "additional_info9", key: "field064", width: 25 },
	  { header: "additional_info10", key: "field065", width: 25 },
	  { header: "additional_info11", key: "field066", width: 25 },
	  { header: "additional_info12", key: "field067", width: 25 },
	  { header: "mshotline_tel", key: "field068", width: 25 },
	  { header: "mshotline_tel2", key: "field069", width: 25 },
	  { header: "mshotline_tel3", key: "field070", width: 25 },
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


exports.uploadStaffJson =  async (req, res) => {
 try{
	 //console.log(req.body[0]); 
	 console.log("count of staff records:");
	 console.log(Object.keys(req.body).length);
	 let total_of_records= Object.keys(req.body).length;
	  var staffs = [];
	 var xls_staffs = [];
      var new_staffs = [];
	  var old_staffs = [];
 
	for ( i in req.body ){
		  var query ={};
		   query.company_id =  ObjectId(BeaCompanyId);
		   query.staff_no =  req.body[i].staff_no;
		   req.body[i].updatedAt = Date.now();
		let mongoDocument =  await Staff.findOne(query).exec();
		
		if (mongoDocument!=undefined)
		{
			 let s=req.body[i];
			
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
									  pro_title2: data.field071,
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
									  direct_tel2: data.direct_tel2,
									  direct_tel3: data.direct_tel3,
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
									  web_link_label: data.web_link_label,
									  web_link2: data.web_link2,
									  web_link_label2: data.web_link_label2,
									  web_link3: data.web_link3,
									  web_link_label3: data.web_link_label3,
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
								});
								  
								staff_log.save(staff_log);
							//backup old staff records to table staff_logs
							}
						});
						 //white action log before send successful
					}
			});
		}else{
			 
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
												  pro_title2: data.field071,
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
												  direct_tel2: data.direct_tel2,
												  direct_tel3: data.direct_tel3,
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
												   web_link_label: data.web_link_label,
												  web_link2: data.web_link2,
												  web_link_label2: data.web_link_label2,
												  web_link3: data.web_link3,
												  web_link_label3: data.web_link_label3,
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
      message: "Could not upload the json file: ",
    });
  }
};