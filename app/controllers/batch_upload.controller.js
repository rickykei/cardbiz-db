const db = require("../models");
const Staffs = db.staffs;
const Staff_log = db.staff_log;
const Action_log = db.action_log;
const readXlsxFile = require('read-excel-file/node')
var ObjectId = require('mongodb').ObjectId; 
const excel = require("exceljs");

exports.uploadStaffExcel =  async (req, res) => {
	try {
		let path =  __basedir + "/uploads/" + req.file.filename;
 	 
		if (req.file == undefined) {
		  return res.status(400).send("Please upload an excel file!");
		}
	let company_id=req.body.company_id; // company doc id
	let uid=req.body.uid;  //citic.hr admin staff doc id
	 var staffs = [];
	 var xls_staffs = [];
      var new_staffs = [];
	  var old_staffs = [];
	   var actionLog=[];
	  
	  var staffLog=[];
	  console.log("＝＝＝＝＝＝＝＝＝＝＝＝＝");
	  console.log("ENTER upload staff excel");
	  console.log("company_id="+company_id);
	  console.log("uid="+uid);


   // convert excel to staff array	  
    xls_staffs=await readXlsxFile(path).then((rows) => {
		 
      // skip header
      rows.shift();
 
			for(row of rows){
			for (let i = 0; i < 26; i++) {
				  if (row[i]==null || row[i]==undefined)
					  row[i]="";
				} 
			var staff = {
			  company_id: company_id,
			  createdBy: uid,
			  company_name_eng: row[0],
			  company_name_chi: row[1],
			  name_eng: row[2],
			  name_chi: row[3],
			  rc_no: row[4],
			  staff_no: row[5],
			  title_eng: row[6],
			  title_chi: row[7],
			  pro_title: row[8],
			  subsidiary_eng:row[9],
			  subsidiary_chi:row[10],
			  address_eng:row[11],
			  address_chi:row[12],
			  work_tel:row[13],
			  work_tel2:row[14],
			  work_tel3:row[15],
			  direct_tel:row[16],
			  direct_tel2:row[17],
			  direct_tel3:row[18],
			  mobile_tel:row[19],
			  mobile_tel2:row[20],
			  mobile_tel3:row[21],
			  mobile_tel4:row[22],
			  mobile_tel5:row[23],
			  fax_no:row[24],
			  fax_no2:row[25],
			  fax_no3:row[26],
			  fax_no4:row[27],
			  fax_no5:row[28],
			  reuters:row[29],
			  work_email:row[30],
			  agent_no:row[31],
			  broker_no:row[32],
			  mpf_no:row[33],
			  hkma_no:row[34],
			  hkma_eng:row[35],
			  hkma_chi :row[36],
			  smartcard_uid:row[37],
			  bizcard_option: row[38],
			  status:row[39],
			};

			staffs.push(staff);
			
		  };
	
	   return staffs;
	   }
	);  
	    // convert excel to staff array
	  
	  for (var s of xls_staffs){
		  var query ={};
		 
		   query.company_id =  ObjectId(company_id);
		   query.staff_no =  s.staff_no;
		let oldStaffDoc =  await Staffs.findOne(query).exec();
		
		if (oldStaffDoc!=undefined)
		{
			
			
			old_staffs.push(s);
			s.company_id=company_id;
			s.updatedAt=Date.now();
			
			console.log("old doc id"+oldStaffDoc.id);
			console.log(oldStaffDoc);
			
			/////////////////////////
			//update old staff no. record
			////////////////////////////
			 Staffs.findByIdAndUpdate(oldStaffDoc.id, s, {new: true,  useFindAndModify: true })
			.then(data => {
				  if (!data) {
					res.status(404).send({
					  message: `Cannot update Staff with id=${id}. Maybe Staff was not found!`
					});
				  } else {
						console.log("batch upload staff update");
						//white action log before send successfully
							actionLog = new Action_log({
							action: "Update Staff Record by Batch Upload",
							log: "batch excel",
							company_id: company_id,
							staff_id: oldStaffDoc.id,
							updatedBy: ObjectId(uid), 
							createdBy: ObjectId(uid), 
							 
							color: "border-theme-1",
						});
						
						 actionLog.save(actionLog).then(data2 => {
							if (!data2){
								res.status(404).send({
									message: `Cannot update Staff with id=${id}. Maybe Staff was not found!`
									});
							}else{
								//backup old staff records to table staff_logs
								console.log("batch update existing staffs log");
								 
								console.log(data);
								staff_log = new Staff_log({
									action_log_id: ObjectId(data2.id),
									staff_id: ObjectId(data._id),
									udid:data.udid,
									company_id: data.company_id,
									rc_no: data.rc_no,
									staff_no: data.staff_no,
									name_eng: data.name_eng,
									name_chi: data.name_chi,
									company_name_eng: data.company_name_eng,
									company_name_chi: data.company_name_chi,
									title_eng: data.title_eng,
									title_chi: data.title_chi,
									  pro_title: data.pro_title,
									  subsidiary_eng: data.subsidiary_eng,
									  subsidiary_chi: data.subsidiary_chi,
									  address_eng: data.address_eng,
									  address_chi: data.address_chi,
									  headshot: data.headshot,
									  work_tel: data.work_tel,
									  work_tel2: data.work_tel2,
									  work_tel3: data.work_tel3,
									  direct_tel: data.direct_tel,
									  direct_tel2: data.direct_tel2,
									  direct_tel3: data.direct_tel3,
									  mobile_tel: data.mobile_tel,
									  mobile_tel2: data.mobile_tel2,
									  mobile_tel3: data.mobile_tel3,
									  mobile_tel4: data.mobile_tel4,
									  mobile_tel5: data.mobile_tel5,
									  fax_no: data.fax_no,
									  fax_no2: data.fax_no2,
									  fax_no3: data.fax_no3,
									  fax_no4: data.fax_no4,
									  fax_no5: data.fax_no5,
									  reuters: data.reuters,
									  work_email: data.work_email,
									  agent_no: data.agent_no,
									  broker_no: data.broker_no,
									  mpf_no: data.mpf_no,
									  hkma_no: data.hkma_no,
									  hkma_eng: data.hkma_eng,
									  hkma_chi: data.hkma_chi,
									  smartcard_uid: data.smartcard_uid,
									  bizcard_option: data.bizcard_option,
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
				   })
			.catch(err => {
				console.log(err);
			  res.status(500).send({message: "Error updating Staff by batch with id=" + id  });
			});
		}else{
			s.company_id=company_id;
			new_staffs.push(s);
			
		}
		
		
	  }
	
	
	if (new_staffs.length>0){
		///////////////////////////
		//insert new staffs records
		///////////////////////////
		
		Staffs.insertMany(new_staffs,(err,data)=>{  
				if(err){  
					res.status(404).send({
						  message: `Cannot update Staff with id=. Maybe Staff was not found!`
						});
				}else{  
					 for (var d of data){
							console.log("batch upload staff create");
							console.log("insertedstaffDocId="+d.id);
							
							//white action log before send successfully
								actionLog = new Action_log({
								action: "Create Staff Record by Batch Upload",
								log: "batch excel",
								company_id: company_id,
								staff_id: d.id,
								createdBy: uid,
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
											staff_id: ObjectId(oldStaffDoc._id),
											udid:oldStaffDoc.udid,
											company_id: oldStaffDoc.company_id,
											rc_no: oldStaffDoc.rc_no,
											staff_no: oldStaffDoc.staff_no,
											name_eng: oldStaffDoc.name_eng,
											name_chi: oldStaffDoc.name_chi,
											company_name_eng: oldStaffDoc.company_name_eng,
											company_name_chi: oldStaffDoc.company_name_chi,
											title_eng: oldStaffDoc.title_eng,
											title_chi: oldStaffDoc.title_chi,
											  pro_title: oldStaffDoc.pro_title,
											  subsidiary_eng: oldStaffDoc.subsidiary_eng,
											  subsidiary_chi: oldStaffDoc.subsidiary_chi,
											  address_eng: oldStaffDoc.address_eng,
											  address_chi: oldStaffDoc.address_chi,
											  headshot: oldStaffDoc.headshot,
											  work_tel: oldStaffDoc.work_tel,
											  work_tel2: oldStaffDoc.work_tel2,
											  work_tel3: oldStaffDoc.work_tel3,
											  direct_tel: oldStaffDoc.direct_tel,
											  direct_tel2: oldStaffDoc.direct_tel2,
											  direct_tel3: oldStaffDoc.direct_tel3,
											  mobile_tel: oldStaffDoc.mobile_tel,
											  mobile_tel2: oldStaffDoc.mobile_tel2,
											  mobile_tel3: oldStaffDoc.mobile_tel3,
											  mobile_tel4: oldStaffDoc.mobile_tel4,
											  mobile_tel5: oldStaffDoc.mobile_tel5,
											  fax_no: oldStaffDoc.fax_no,
											  fax_no2: oldStaffDoc.fax_no2,
											  fax_no3: oldStaffDoc.fax_no3,
											  fax_no4: oldStaffDoc.fax_no4,
											  fax_no5: oldStaffDoc.fax_no5,
											  reuters: oldStaffDoc.reuters,
											  work_email: oldStaffDoc.work_email,
											  agent_no: oldStaffDoc.agent_no,
											  broker_no: oldStaffDoc.broker_no,
											  mpf_no: oldStaffDoc.mpf_no,
											  hkma_no: oldStaffDoc.hkma_no,
											  hkma_eng: oldStaffDoc.hkma_eng,
											  hkma_chi: oldStaffDoc.hkma_chi,
											  smartcard_uid: oldStaffDoc.smartcard_uid,
											  bizcard_option: oldStaffDoc.bizcard_option,
											  profile_counter: oldStaffDoc.profile_counter,
											  vcf_counter: oldStaffDoc.vcf_counter,
											  status: oldStaffDoc.status, 
											  updatedBy: ObjectId(uid), 
											  createdBy: oldStaffDoc.createdBy, 
											  createdAt: oldStaffDoc.createdAt, 
											  updatedAt: Date.now(),
										});
										  console.log("copy staff_log");
													  console.log(staff_log);
										staff_log.save(staff_log);
									//backup old staff records to table staff_logs
									 //white action log before send successful
										}
								});
				 
					 }
				}
					   
		})
		/*
		/////////////////////////////
		// insert record one by one//
		/////////////////////////////
		
		for (var ns of new_staffs){
			
			console.log(ns);
			 Staffs
			.create(ns)
			.then(data => {
				console.log("batch upload staff create");
				console.log("insertedstaffDocId="+data.id);
				 //white action log before send successfully
				 const actionLog = new Action_log({
					action: "Create Staff Record by Batch Upload",
					log: "batch excel",
					company_id: data.company_id,
					staff_id: data.id,
					createdBy: data.createdBy,
					color: "border-theme-1",
				});
				
				actionLog.save(actionLog);
				 //white action log before send successfully
			 
			})
		}
		/////////////////////////////
		//END insert record one by one//
		/////////////////////////////
		*/
			 
	}
	console.log("new"+new_staffs.length);
	console.log("old"+old_staffs.length);
	console.log("＝＝＝＝＝＝＝＝＝＝＝＝＝");
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
          company_id: company_id,
		  company_name_eng: row[0],
		  company_name_chi: row[1],
		  name_eng: row[2],
		  name_chi: row[3],
		  rc_no: row[4],
		  staff_no: row[5],
          title_eng: row[6],
          title_chi: row[7],
          pro_title: row[8],
		  subsidiary_eng:row[9],
		  subsidiary_chi:row[10],
		  address_eng:row[11],
		  address_chi:row[12],
		  work_tel:row[13],
		   work_tel2:row[14],
			  work_tel3:row[15],
			  direct_tel:row[16],
			  direct_tel2:row[17],
			  direct_tel3:row[18],
			  mobile_tel:row[19],
			  mobile_tel2:row[20],
			  mobile_tel3:row[21],
			  mobile_tel4:row[22],
			  mobile_tel5:row[23],
			  fax_no:row[24],
			  fax_no2:row[25],
			  fax_no3:row[26],
			  fax_no4:row[27],
			  fax_no5:row[28],
			  reuters:row[29],
			  work_email:row[30],
			  agent_no:row[31],
			  broker_no:row[32],
			  mpf_no:row[33],
			  hkma_no:row[34],
			  hkma_eng:row[35],
			  hkma_chi :row[36],
			  smartcard_uid:row[37],
			  bizcard_option: row[38],
			  status:row[39],
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
		  company_name_eng: obj.company_name_eng,
		  company_name_chi: obj.company_name_chi,
		  name_eng: obj.name_eng,
		  name_chi: obj.name_chi,
		  rc_no:obj.rc_no,
		  staff_no: obj.staff_no,
		  title_eng:obj.title_eng,
		  title_chi:obj.title_chi,
		  pro_title:obj.pro_title,
		  subsidiary_eng: obj.subsidiary_eng,
		  subsidiary_chi: obj.subsidiary_chi,
		  address_eng: obj.address_eng,
		  address_chi: obj.address_chi,
		    work_tel: obj.work_tel,
		  work_tel2: obj.work_tel2,
          work_tel3: obj.work_tel3,
			direct_tel: obj.direct_tel,
			direct_tel2: obj.direct_tel2,
			direct_tel3: obj.direct_tel3,
			mobile_tel: obj.mobile_tel,
			mobile_tel2: obj.mobile_tel2,
			mobile_tel3: obj.mobile_tel3,
			mobile_tel4: obj.mobile_tel4,
			mobile_tel5: obj.mobile_tel5,
			fax_no: obj.fax_no,
			fax_no2: obj.fax_no2,
			fax_no3: obj.fax_no3,
			fax_no4: obj.fax_no4,
			fax_no5: obj.fax_no5,
		  reuters:obj.reuters,
          work_email: obj.work_email,
          agent_no: obj.agent_no,
          broker_no: obj.broker_no,
		  
		  mpf_no:obj.mpf_no,
		  hkma_no:obj.hkma_no,
		  hkma_eng:obj.hkma_eng,
		  hkma_chi:obj.hkma_chi,
		  
		  smartcard_uid:obj.smartcard_uid,
		  bizcard_option: obj.bizcard_option,
		  status:obj.status,
		 
         
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffs");

    worksheet.columns = [
		{ header: "company_name_eng", key: "company_name_eng", width: 25 },
      { header: "company_name_chi", key: "company_name_chi", width: 25 },
      { header: "name_eng", key: "name_eng", width: 25 },
      { header: "name_chi", key: "name_chi", width: 25 },
      { header: "rc_no", key: "rc_no", width: 25 },
      { header: "staff_no", key: "staff_no", width: 25 },
	  { header: "title_eng", key: "title_eng", width: 25 },
	  { header: "title_chi", key: "title_chi", width: 25 },
	  { header: "pro_title", key: "pro_title", width: 25 },
	  { header: "subsidiary_eng", key: "subsidiary_eng", width: 25 },
	  { header: "subsidiary_chi", key: "subsidiary_chi", width: 25 },
	  { header: "address_eng", key: "address_eng", width: 25 },
	  { header: "address_chi", key: "address_chi", width: 25 },
	  { header: "work_tel", key: "work_tel", width: 25 },
	  { header: "work_tel2", key: "work_tel2", width: 25 },
	  { header: "work_tel3", key: "work_tel3", width: 25 },
	  { header: "direct_tel", key: "direct_tel", width: 25 },
	  { header: "direct_tel2", key: "direct_tel2", width: 25 },
	  { header: "direct_tel3", key: "direct_tel3", width: 25 },
	  { header: "mobile_tel", key: "mobile_tel", width: 25 },
	  { header: "mobile_tel2", key: "mobile_tel2", width: 25 },
	  { header: "mobile_tel3", key: "mobile_tel3", width: 25 },
	  { header: "mobile_tel4", key: "mobile_tel4", width: 25 },
	  { header: "mobile_tel5", key: "mobile_tel5", width: 25 },
	  { header: "fax_no", key: "fax_no", width: 25 },
	  { header: "fax_no2", key: "fax_no2", width: 25 },
	  { header: "fax_no3", key: "fax_no3", width: 25 },
	  { header: "fax_no5", key: "fax_no4", width: 25 },
	  { header: "fax_no5", key: "fax_no5", width: 25 },
	  { header: "reuters", key: "reuters", width: 25 },
	  { header: "work_email", key: "work_email", width: 25 },
	  { header: "agent_no", key: "agent_no", width: 25 },
	  { header: "broker_no", key: "broker_no", width: 25 },
	  { header: "mpf_no", key: "mpf_no", width: 25 },
	  { header: "hkma_no", key: "hkma_no", width: 25 },
	  { header: "hkma_eng", key: "hkma_eng", width: 25 },
	  { header: "hkma_chi", key: "hkma_chi", width: 25 },
	   
	  { header: "smartcard_uid", key: "smartcard_uid", width: 25 },
	  { header: "bizcard_option", key: "bizcard_option", width: 25 },
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
