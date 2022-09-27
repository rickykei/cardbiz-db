const db = require("../models");
const uploadBanner = require("../middleware/uploadBanner");

//const upload = require("../middleware/upload");
const GridFSBucket = require("mongodb").GridFSBucket;
const Company = db.companies;
const Smartcard = db.smartcards;

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page* limit : 0;
  return { limit, offset };
};
// Create and Save a new company
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a company
  const company = new Company({
    name: req.body.name,
    code: req.body.code,
    no_of_license: req.body.no_of_license,
    no_of_admin: req.body.no_of_admin,
	smartcard_uid: req.body.smartcard_uid,
	fname: req.body.fname,
	lname: req.body.lname,
	 company_name: req.body.company_name,
	  work_mail: req.body.work_mail,
	  country_cd: req.body.country_cd,
	  website: req.body.website,
	  position: req.body.position,
	  work_tel: req.body.work_tel,
	  address: req.body.address,
	  sub_division : req.body.sub_division,
	  department: req.body.department,
	  banner: req.body.banner,
	  logo: req.body.logo,
    status: req.body.status ? req.body.status : false
  });
  
  let smart_arr=null;
  if (typeof req.body.smartcard_uid !== 'undefined') {
	smart_arr = req.body.smartcard_uid.split(',')?   req.body.smartcard_uid.split(','): req.body.smartcard_uid ;
  }
  console.log("smart_arr"+smart_arr);
	let smartcard=null;
	
  // Save company in the database
  company
    .save(company)
    .then(data => {
		if(smart_arr!=null){
			smart_arr.forEach((e)=>{
				smartcard = new Smartcard({
				uid: e,
				company_id: company.id,
				status: true,
			});
			 console.log("smartcard"+smartcard);
			smartcard.save(smartcard);
			})
		}
			
	
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the company."
      });
    });
};

// Retrieve all company from the database.
exports.findAll = (req, res) => {
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { name: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{};
  Company.paginate(condition, { offset, limit , sort})
    .then((data) => {
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
          err.message || "Some error occurred while retrieving companies."
      });
    });
};

// Find a single company with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log("find"+id);
  Company.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found company with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving company with id=" + id });
    });
};

// Update a company by the id in the request
exports.update = (req, res) => {
	
	
	
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  	//let smart_arr = []; 
	let smartcard=null;
	
	console.log('req.body.smartcard_uid');
	console.log(req.body.smartcard_uid);
/*   if(req.body.smartcard_uid.indexOf(',') != -1)
  {
	  smart_arr = req.body.smartcard_uid.split(',')?   req.body.smartcard_uid.split(','): req.body.smartcard_uid ;
    console.log("smart_arr"+smart_arr);
  }else
	  smart_arr[0]=req.body.smartcard_uid;
	 */
	  let smart_arr=null;
  if (typeof req.body.smartcard_uid !== 'undefined') {
	smart_arr = req.body.smartcard_uid.split(',')?   req.body.smartcard_uid.split(','): req.body.smartcard_uid ;
  }
	
  Company.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update company with id=${id}. Maybe company was not found!`
        });
      } else {
		  Smartcard.deleteMany({company_id: id}, { useFindAndModify: false }).then(data => {
			 console.log(id);
		});
		console.log("--before forEach");
			smart_arr.forEach((e)=>{
				smartcard = new Smartcard({
				uid: e,
				company_id: data.id,
				status: true,
			});
			 console.log("smartcard"+smartcard);
			smartcard.save(smartcard);
			});
		  res.send({ message: "company was updated successfully." });
	  }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating company with id=" + id
      });
    });
};

  // update company by hr admin
exports.updateByHRAdmin = async (req, res) => {
	
	console.log("update Company by hr admin");
	
	await uploadBanner(req, res);
	 
	 const id = req.params.id;
	 //update company docid
	 //console.log("company Docid");
	 //console.log(id);
	 console.log("req.body");
	 console.log(req.body);
	 console.log("req.files.banner");
	 console.log(req.files.banner);
	
 
 
	   if (req.files!== undefined){
		    //console.log("bannerFilesObjID");
			//console.log(req.files.banner[0].filename);
 
		if(req.files.banner!==undefined)
			req.body.banner=req.files.banner[0].filename;
	  	if(req.files.logo!==undefined)
		  req.body.logo=req.files.logo[0].filename;
    
	   }
 
  
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  
 
  Company.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update company with id=${id}. Maybe company was not found!`
        });
      } else {
		   
		  res.send({ message: "company was updated successfully." });
	  }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating company with id=" + id
      });
    });
};

// Delete a company with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
console.log("del="+id);
  Company.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete company with id=${id}. Maybe company was not found!`
        });
      } else {
		  console.log(id);
		Smartcard.deleteMany({company_id: id}, { useFindAndModify: false }).then(data => {
			 console.log(id);
		}
		);
        res.send({
          message: "company was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete company with id=" + id
      });
    });
};

// Delete all companies from the database.
exports.deleteAll = (req, res) => {
  Company.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} companyies were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all companies."
      });
    });
};

// Find all published companyies
exports.findAllActive = (req, res) => {
  Company.find({ status: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving companyies."
      });
    });
};

// Find companyies code list
exports.findCodeList = (req, res) => {
  Company.aggregate([
	{
	  $group:{
		  _id: {code : "$code"},
		  label: {$first: "$code"},
		  value:{$first: "$_id"},
		  }
	}
  ]).then((data) => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving companyies."
      });
    });
};
