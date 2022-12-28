const db = require("../models");
const Action_log = db.action_log;
var ObjectId = require('mongodb').ObjectId; 

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page* limit : 0;
  return { limit, offset };
}; 

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  console.log("entered actionlog.findall");
  const populate=['company_id','createdBy'];
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { action: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{ createdAt:-1,_id:1  };
 
  let queryArray=[];
  let query={};  
		 
  
  Action_log.paginate(query, { populate,offset, limit , sort})
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
          err.message || "Some error occurred while retrieving action log."
      });
    });
};

exports.setLog = async (req, res) => {
	console.log("entered action_log.setLog");
	if (!req.body) {
		return res.status(400).send({
		  message: "Data can not be empty!"
		});
	}
	console.log(req.body);
	
	const actionLog = new Action_log({
		action: req.body.action,
		log: req.body.log,
		company_id: ObjectId(req.body.company_id),
		createdBy: ObjectId(req.body.uid),
		
	});
	
	 
	 actionLog
    .save(actionLog)
    .then(data => {
		   res.send(data);
			})
	.catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the company."
      });
    });
	 
};


exports.getByAdminId =  (req, res) => {
  console.log("action_log.getByAdminId Start");
  let query={};
     const populate="";
  const uid = req.query.uid;
   const { currentPage, pageSize, search, orderBy , companyId} = req.query;
  console.log("find admin uid = "+ObjectId(uid));
   
	query.createdBy =  ObjectId(uid);	
	
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{ updatedAt : -1 };
 Action_log.paginate(query, { populate,offset, limit , sort})
  .then((data) => {
    
     var i=0;
    var exportdata=[];
	for ( d of data.docs){
      const obj={ label: d.action, time: d.createdAt,color:d.color,key: i};
	  
	  exportdata.push(obj);
	  i++;
	};
      
		  res.send(exportdata);
      console.log("getByAdminId success");
  }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vcfCounter."
      });
  });
};

exports.getByStaffId =  (req, res) => {
  console.log("action_log.getByStaffId Start");
  let query={};
  const populate="";
  const id = req.query.staffId;
  const { currentPage, pageSize, search, orderBy , staffId} = req.query;
  console.log("find staff id = "+ObjectId(id));
   
  query.staff_id =  ObjectId(id);	
	
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{ updatedAt : -1 };
 Action_log.paginate(query, { populate,offset, limit , sort})
  .then((data) => {
    
     var i=0;
    var exportdata=[];
	for ( d of data.docs){
      const obj={ label: d.action, time: d.createdAt,color:d.color,key: i};
	  
	  exportdata.push(obj);
	  i++;
	};
      
		  res.send(exportdata);
      console.log("getByStaffId success");
  }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vcfCounter."
      });
  });
};
exports.getByCompanyId = (req, res) => {
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { name: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{};
  Action_log.paginate(condition, { offset, limit , sort})
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
          err.message || "Some error occurred while retrieving vcfCounter."
      });
    });
};

