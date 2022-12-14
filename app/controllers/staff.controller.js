const upload = require("../middleware/upload");
const GridFSBucket = require("mongodb").GridFSBucket;
const db = require("../models");
const crypto = require('crypto');
var ObjectId = require('mongodb').ObjectId; 
const Staff = db.staffs;
const Action_log = db.action_log;
var nodemailer = require('nodemailer');
var mailTransport = nodemailer.createTransport( {

	host: "smtpout.secureserver.net",  
     debug: true,
	 secure: true,
  secureConnection: true,
  port: 465,
       tls: {rejectUnauthorized: false},  
  auth: {
    user: "admin@whospets.com",
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
 console.log(req.body);
  // Create a Staff
  const staff = new Staff({
    udid: crypto.randomUUID(),
    fname: req.body.fname,
	lname: req.body.lname,
	company_id: req.body.company_id,
	headshot: req.body.headshot,
	work_email: req.body.work_email,
	home_email: req.body.home_email,
	other_email: req.body.other_email,
	position: req.body.position,
	work_tel: req.body.work_tel,
	work_tel2: req.body.work_tel2,
	mobile: req.body.mobile,
	mobile2: req.body.mobile2,
	home_tel: req.body.home_tel,
	fax: req.body.fax,
	web_link: req.body.web_link,
	web_link2: req.body.web_link2,
	web_link3: req.body.web_link3,
	web_link4: req.body.web_link4,
	web_link5: req.body.web_link5,
	web_link6: req.body.web_link6,
	address: req.body.address,
	address2: req.body.address2,
	division: req.body.division,
	department: req.body.department,
	country: req.body.country,
	bio : req.body.bio,
	company_website_url : req.body.company_website_url,
	more_info_tab_url : req.body.more_info_tab_url,
	facebook_url: req.body.facebook_url,
	instagram_url : req.body.instagram_url,
	whatsapp_url : req.body.whatsapp_url,
	linkedin_url : req.body.linkedin_url,
	youtube_url : req.body.youtube_url,
	twitter_url : req.body.twitter_url,
	wechat_url : req.body.wechat_url,
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
		
		actionLog.save(actionLog);
		 //white action log before send successfully
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
  var condition = search ? { name: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{ updatedAt : -1 };
  Staff.paginate(condition, { populate,offset, limit , sort})
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
  let query={};
    
		
	if (search)
	query.fname = {  $regex: new RegExp(search), $options: "i" } ;
	if (companyId!="")
    query.company_id =  ObjectId(companyId);
	else
	query.company_id =  ObjectId(0);	
	
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{ updatedAt : -1 };
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

  
  
  Staff.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Staff with id=${id}. Maybe Staff was not found!`
        });
      } else 
	  {
		  
		   //white action log before send successfully
		 const actionLog = new Action_log({
			action: "Update Staff Record",
			log: data.fname,
			company_id: data.company_id,
			staff_id: data.id,
			createdBy: data.createdBy,
			color: "border-theme-1",
		});
		
		actionLog.save(actionLog);
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
				mailTransport.sendMail(
			  {
				from: 'staff notification <admin@whospets.com>',
				to: 'rickykei@gmail.com',
				subject: 'Hi :)'+doc.id,
				html: '<p>Hi '+doc.fname+' '+doc.lname+'</p><p>Welcome onboard, please find your digital business card from the QR Code below:</p><img width="350" src="https://whospets.com/Touchless/genvcf2png.php?sig='+doc.id+'"/><p>To share your contact with your future prospects, you can simply scan this QR Code to get access to your digital profile. I would recommend you to save this http link as a shortcut on your phone for future use.  </p> <p> Please let me know if you have any questions with regards or if you need any help with your digital business card. </p> <p>Best regards,</p> <p>Stephen Fung</p><p>Admin Manager</p>',
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
