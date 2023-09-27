const upload = require("../middleware/upload");
const GridFSBucket = require("mongodb").GridFSBucket;
const db = require("../models");
const crypto = require('crypto');
var ObjectId = require('mongodb').ObjectId; 
const Staff = db.staffs;
const Staff_log = db.staff_log;
const Action_log = db.action_log;
var nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');
 


var mailTransport = nodemailer.createTransport( {

	host: "smtpout.secureserver.net",  
     debug: true,
	 secure: true,
  secureConnection: true,
  port: 465,
       tls: {rejectUnauthorized: false},  
  auth: {
    user: "admin@profiles.digital",
    pass: "soso2016~",
	
  
  },
  logger: true,
});

const getPagination = (page, size) => {
	const limit = size ? +size : 5;
	const offset = page ? page* limit : 0;
	return { limit, offset };
};

let uploadFiles="";
// Create and Save a new Staff
exports.create = async (req, res) => {
  // Validate request
  console.log("entered Staff.create");
   
	//upload head shot 
	
  await upload(req, res);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  let uid=req.body.createdBy;  //admin staff doc id
  
  // Create a Staff
  const staff = new Staff({
    udid: crypto.randomUUID(),
	rc_no: req.body.rc_no,
	staff_no: req.body.staff_no,
    name_eng: req.body.name_eng,
	name_chi: req.body.name_chi,
	company_name_eng: req.body.company_name_eng,
	company_name_chi: req.body.company_name_chi,
	title_eng: req.body.title_eng,
	title_chi: req.body.title_chi,
	company_id: req.body.company_id,
	headshot: req.body.headshot,
	pro_title: req.body.pro_title,
	subsidiary_eng: req.body.subsidiary_eng,
	subsidiary_chi: req.body.subsidiary_chi,
	address_eng: req.body.address_eng,
	address_chi: req.body.address_chi,
	work_tel: req.body.work_tel,
	work_tel2: req.body.work_tel2,
	work_tel3: req.body.work_tel3,
	direct_tel: req.body.direct_tel,
	direct_tel2: req.body.direct_tel2,
	direct_tel3: req.body.direct_tel3,
	mobile_tel: req.body.mobile_tel,
	mobile_tel2: req.body.mobile_tel2,
	mobile_tel3: req.body.mobile_tel3,
	mobile_tel4: req.body.mobile_tel4,
	mobile_tel5: req.body.mobile_tel5,
	fax_no: req.body.fax_no,
	fax_no2: req.body.fax_no2,
	fax_no3: req.body.fax_no3,
	fax_no4: req.body.fax_no4,
	fax_no5: req.body.fax_no5,
	reuters: req.body.reuters,
	work_email: req.body.work_email,
	agent_no: req.body.agent_no,
	broker_no: req.body.broker_no,
	mpf_no: req.body.mpf_no,
	hkma_no: req.body.hkma_no,
	hkma_eng: req.body.hkma_eng,
	hkma_chi: req.body.hkma_chi,
 	smartcard_uid : req.body.smartcard_uid,
	bizcard_option: req.body.bizcard_option,
	profile_counter: 0,
	vcf_counter: 0,
	 status: req.body.status ? req.body.status : false,
	createdBy: req.body.createdBy,
	updatedBy: req.body.updatedBy
  });
    console.log("staff");
	staff.company_id=req.body.company_id;
    console.log(staff);
  const id = req.params.id;
	  if (req.file!== undefined){
	  staff.headshot=req.file.filename;
	  console.log("fileObjID");
	  console.log(req.file.id);
	  }

  // Save Staff in the database
  staff
    .save(staff)
    .then(data => {
		 //white action log before send successfully
		 const actionLog = new Action_log({
			action: "Create Staff",
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
								console.log("uid");
								console.log(uid);
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
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Staff."
      });
    });
};

 
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  console.log("entered Staff.findall");
  const populate=['company_id','createdBy','updatedBy'];
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { name_eng: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{ updatedAt:-1,_id:1  };
 
    let queryArray=[];
  let query={};  
		
	if (search){
		queryArray.push({"name_eng" : {  $regex: new RegExp(search), $options: "i" }}) ;
		queryArray.push({"staff_no" : {  $regex: new RegExp(search), $options: "i" }}) ;
		queryArray.push({"rc_no" : {  $regex: new RegExp(search), $options: "i" }}) ;
		query['$or'] = queryArray;
	}
  console.log("entered Staff.findall offset");
  console.log(offset);
  console.log("entered Staff.findall limit");
  console.log(limit);
  console.log("entered Staff.findall condition");
  console.log(condition);
  console.log("entered Staff.findall sort");
  console.log(sort);
  
  
  Staff.paginate(query, { populate,offset, limit , sort})
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

exports.findByCompanyId = (req, res) => {
  console.log("entered Staff.findByCompanyId");
  const populate=['company_id','createdBy','updatedBy'];
  const { currentPage, pageSize, search, orderBy , companyId} = req.query;
  let queryArray=[];
  let query={};  
		
	if (search){
		queryArray.push({"name_eng" : {  $regex: new RegExp(search), $options: "i" }}) ;
		queryArray.push({"staff_no" : {  $regex: new RegExp(search), $options: "i" }}) ;
		queryArray.push({"rc_no" : {  $regex: new RegExp(search), $options: "i" }}) ;
		query['$or'] = queryArray;
	}
	
	if (companyId!="")
		query.company_id =  ObjectId(companyId);
	else
		query.company_id =  ObjectId(0);	
	
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{  updatedAt:-1,_id:1};
  Staff.paginate(query, { populate,offset, limit , sort})
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

// Find a single Staff with an id
exports.findOne = (req, res) => {
	console.log("staff.findOne");
  const id = req.params.id;

  Staff.findById(id).populate('company_id')
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Staff with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Staff with id=" + id });
    });
};

// Update a Staff by the id in the request
exports.update = async (req, res) => {
	
	console.log("entered staff.update");
 await upload(req, res);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  if (req.file!== undefined){
  req.body.headshot=req.file.filename;
    console.log("fileObjID");
  console.log(req.file.id);
  }
 
  console.log("update id");
  console.log(id);
  console.log("body.udid");
  console.log(req.body.udid);

    
  let uid=req.body.uid;  //citic.hr admin staff doc id
  req.body.updatedAt=Date.now();
  
  console.log(req.body);
  
  Staff.findByIdAndUpdate(id, req.body, {new: true, useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Staff with id=${id}. Maybe Staff was not found!`
        });
      } else {
		  
		  console.log("staff record updated -- inside then");
		  console.log(data);
		  
		   //white action log before send successfully
		 const actionLog = new Action_log({
			action: "Update Staff Record",
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
								//backup old staff records to table staff_logs
								console.log("actionLog save for edit");
								 
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
		 //white action log before send successfully
		 
		  res.send({ message: "Staff was updated successfully." });
	  }
    })
    .catch(err => {
		console.log(err);
      res.status(500).send({
        message: "Error updating Staff with id=" + id
      });
    });
};

// send staff email notification
exports.sendNotificationByStaffDocId = async (req, res) => {
  console.log("staff.sendNotificationByStaffDocId");
  if (!req.body.staffDocId) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }else{
	  let staffIdArray=req.body.staffDocId;
	console.log(req.body.staffDocId);
	console.log(req.body.uid);
	console.log(req.body.companyId);
	staffIdArray.forEach(e=>{
		Staff.findById(ObjectId(e)).
		then(doc=>{
			
			// Encrypt
				var ciphertext = encodeURIComponent(CryptoJS.AES.encrypt(doc.id, "12345678123456781234567812345678",{mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7}).toString());
			console.log("criphertext=");
			console.log(ciphertext);
			
				mailTransport.sendMail(
			  {
				from: 'staff notification <admin@e-profile.digital>',
				//to: 'ricky.kei@gmail.com',
				//bcc: 'stephen@nfctouch.com.hk',
				to: 'Namecard_Application@cncbinternational.com',
				subject: 'E-Name card (QR Code) '+doc.work_email,
				html: '<p>****************************************************************</p><p>This is an auto-message sent from the system. Please do no reply to this e-mail.</p><p>****************************************************************</p><p>Dear Colleague,</p><p>Please retrieve your e-name card from the below QR Code:</p><img width="250" src="https://namecard.cncbintl.com/profile/Touchless/genvcf2png.php?key='+ciphertext+'"/><p>To share your business contact with your future prospects, simply ask he / she to scan this QR Code to get access to your digital business profile. </p><p>We would recommend you to save this http link as a shortcut on your smartphone for your own convenience. </p><p>The user manual is now available at EIP document library and please click the link  [<a href="http://eip.cncbinternational.com/dept/css/_layouts/15/listform.aspx?PageType=4&ListId=%7BF93C54E8%2D0139%2D4124%2DA7F9%2D3774BCA082CD%7D&ID=6557&ContentTypeID=0x01006370EF457A75334BA00991EB61622412"><span>HERE</span></a><span>]  to access. </span></p><p>Should there be any change in your name card information, such as phone number, title, department / Division name in future, please notify us by using the application form  [<a href="https://clicktime.symantec.com/15tStcg6wJHkRfamayGyM?h=uTdXUHNpEysQ0FwLZhqLSxT5URhmG1mj1O0xpMzjSsE=&u=http://eip.cncbinternational.com/Dept/CSS/_layouts/15/WopiFrame.aspx?sourcedoc%3D/Dept/CSS/Lists/CKWB%2520Document%2520Library/Attachments/6544/Requisition%2520Form%2520for%2520Business%2520Card%2520%28e-form%29.xlsx%26action%3Ddefault"><span>HERE</span></a><span>]  and we shall update upon confirmation from the related units.  All the changes will be made in your digital profile while your QR code (the http link to your digital profile) will be kept unchanged.</span></p><p> If you have any enquiries or need further assistance regarding the e-name card, please feel free to contact CS-Aggie Yeung (x 2063) / Gigi Wong (x 2065).</p><p>Best regards,</p> <p>Corporate Services</p>',
				//html: '<p>Dear Colleague,</p><p>Please find below your e-name card retrievable from the QR Code:</p><img width="350" src="http://whospets.com/profile/Touchless/genvcf2png.php?key='+ciphertext+'"/><p>To share your contact with your future prospects, you can simply scan this QR Code to get access to your digital profile. We would recommend you to save this http link as a shortcut on your phone for future uase.</p><p>The user manual is now available at the EIP document library and please click the link  [<a href="http://eip.cncbinternational.com/Dept/CSS/_layouts/15/listform.aspx?PageType=4&amp;ListId=%7B1E0637EC%2DD6B0%2D43B6%2DA597%2D6707517C8714%7D&amp;ID=6557&amp;ContentTypeID=0x01006370EF457A75334BA00991EB61622412"><span>HERE</span></a><span>]  to access. </span></p><p> FYI, CS shall update the new office address from system before your office relocation to TTP.  No change / update on your QR code is required.</p><p> If you have any enquiries or need further assistance regarding the e-name card, please feel free to contact CS-Aggie Yeung (x 2063) / Gigi Wong (x 2065).</p><p>Best regards,</p> <p>Corporate Services</p>',
			  },
			  function(err) {
				if (err) {
				  console.log('Unable to send email: ' + err);
				}
			  },
			);
		})
	}
	);
	 

  }
   res.send({ message: "notification was sent successfully." });
}
// Delete a Staff with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Staff.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Staff with id=${id}. Maybe Staff was not found!`
        });
      } else {
        res.send({
          message: "Staff was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Staff with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Staff.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Staff were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Staff."
      });
    });
};

// Find all published Staff
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
