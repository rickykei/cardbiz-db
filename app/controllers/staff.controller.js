const upload = require("../middleware/upload");
const GridFSBucket = require("mongodb").GridFSBucket;
const db = require("../models");
const crypto = require('crypto');
var ObjectId = require('mongodb').ObjectId; 
const Staff = db.staffs;
const Action_log = db.action_log;



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
	company_id: req.body.company_id,
	company_name_eng: req.body.company_name_eng,
	company_name_chi: req.body.company_name_chi,
    fname: req.body.fname,
	lname: req.body.lname,
	staff_no: req.body.staff_no,
	headshot: req.body.headshot,
	work_email: req.body.work_email,
	work_email2: req.body.work_email2,
	work_email3: req.body.work_email3,
	home_email: req.body.home_email,
	other_email: req.body.other_email,
	position: req.body.position,
	work_tel: req.body.work_tel,
	work_tel2: req.body.work_tel2,
	work_tel3: req.body.work_tel3,
	work_tel4: req.body.work_tel4,
	mobile: req.body.mobile,
	mobile2: req.body.mobile2,
	mobile3: req.body.mobile3,
	mobile4: req.body.mobile4,
	home_tel: req.body.home_tel,
	fax: req.body.fax,
	web_link: req.body.web_link,
	web_link2: req.body.web_link2,
	web_link3: req.body.web_link3,
	web_link4: req.body.web_link4,
	web_link5: req.body.web_link5,
	web_link6: req.body.web_link6,
	web_link_label: req.body.web_link_label,
	web_link_label2: req.body.web_link_label2,
	web_link_label3: req.body.web_link_label3,
	web_link_label4: req.body.web_link_label4,
	web_link_label5: req.body.web_link_label5,
	web_link_label6: req.body.web_link_label6,
	address: req.body.address,
	address2: req.body.address2,
	address3: req.body.address3,
	address4: req.body.address4,
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
	wechatpage_url: req.body.wechatpage_url,
	tiktok_url: req.body.tiktok_url,
	line_url: req.body.line_url,
	facebook_messenger_url: req.body.facebookmessenger_url,
	weibo_url: req.body.weibo_url,
	bilibili_url: req.body.bilibili_url,
	qq_url: req.body.qq_url,
	zhihu_url: req.body.zhihu_url,
	app_store_url: req.body.appsstore_url,
	google_play_url: req.body.googleplay_url,
	snapchat_url: req.body.snapchat_url,
	telegram_url: req.body.telegram_url, 
	note: req.body.xiaohongshu_url,
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
  var  sort = orderBy? {[orderBy] : 1 }:{updatedAt:-1,_id:1 };
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

  if (req.body.smartcard_uid=="")
	  req.body.smartcard_uid=null;
  
  const updatedoc=req.body;
   console.log(updatedoc);
  Staff.findByIdAndUpdate(id, updatedoc, { useFindAndModify: false ,omitUndefined: false,})
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
 