const db = require("../models");

const crypto = require('crypto');
const Staff = db.staffs;
const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page* limit : 0;
  return { limit, offset };
    
};

let uploadFiles="";
// Create and Save a new Staff
exports.create = (req, res) => {
  // Validate request
  if (!req.body.company_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

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
	created_by: req.body.created_by,
	updated_by: req.body.updated_by
  });

  // Save Staff in the database
  staff
    .save(staff)
    .then(data => {
		//upload head shot after content uploaded
		
				uploadFiles = async (req, res) => {
				  try {
					await upload(req, res);
					console.log(req.files);

					if (req.files.length <= 0) {
					  return res
						.status(400)
						.send({ message: "You must select at least 1 file." });
					}

					return res.status(200).send({
					  message: "Files have been uploaded.",
					});

					
				  } catch (error) {
					console.log(error);

					if (error.code === "LIMIT_UNEXPECTED_FILE") {
					  return res.status(400).send({
						message: "Too many files to upload.",
					  });
					}
					return res.status(500).send({
					  message: `Error when trying upload many files: ${error}`,
					});

					// return res.send({
					//   message: "Error when trying upload image: ${error}",
					// });
				  }
				};
		//upload head shot after content uploaded
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Staff."
      });
    });
};

const populate=['company_id','created_by','updated_by'];
 
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
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

// Find a single Staff with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Staff.findById(id)
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
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Staff.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Staff with id=${id}. Maybe Staff was not found!`
        });
      } else res.send({ message: "Staff was updated successfully." });
    })
    .catch(err => {
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
