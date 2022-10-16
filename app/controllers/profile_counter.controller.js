 
const db = require("../models");
const Profile_counter = db.profile_counter;
var ObjectId = require('mongodb').ObjectId; 
 

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page* limit : 0;
  return { limit, offset };
};
 
exports.create = (req, res) => {
	console.log("profile count create fname");
	 
	if (!req.body.fname) {
			res.status(400).send({ message: "Content can not be empty!" });
    return;
	}
  // Validate request
  const profileCounter = new Profile_counter({
    staff_id: "6325ebcb74abae59f154dc7f",
    ip: "16.16.1.2",
	user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
	 
  });
  
  
 profileCounter
    .save(profileCounter)
    .then(data => {
		  res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Profile_counter."
      });
    });
  
};
 
exports.getProfileCountByStaffId =  (req, res) => {
  console.log("getProfileCountByStaffId Start");

  const id = req.query.staff_id;
   
  console.log("find staff_id = "+ObjectId(id));
  
  Profile_counter.aggregate([
	{
    $match: {staff_id: ObjectId(id)}
  },
  {
	  $group:{
			_id: { staff_id: "$staff_id",
			labels: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" ,timezone: "Asia/Hong_Kong"} },
				},
        count:{$sum:1}
			}
	},
	{$sort:{"_id":1}}
	,
	{ $limit : 7 }
	  
  ]).then((data) => {
    console.log(data);
    var labels=[];
    var count=[];
      data.forEach(a => {
        labels.push(a._id.labels);
       count.push(a.count);
      });
      
		  res.send({labels,count});
      console.log("getProfileCountByStaffId by staff_id success");
  }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving getProfileCountByStaffId."
      });
  });
};

exports.getProfileCountMonthlyByStaffId =  (req, res) => {
  console.log("getProfileCountMonthlyByStaffId Start");

  const id = req.query.staff_id;
   
  console.log("find staff_id = "+ObjectId(id));
  
  Profile_counter.aggregate([
	{
    $match: {staff_id: ObjectId(id)}
  },
  {
	  $group:{
			_id: { staff_id: "$staff_id",
			labels: { $dateToString: { format: "%Y-%m", date: "$createdAt" ,timezone: "Asia/Hong_Kong"} },
				},
        count:{$sum:1}
			}
	},
	{$sort:{"_id":1}}
	,
	{ $limit : 12 }
	  
  ]).then((data) => {
    console.log(data);
    var labels=[];
    var count=[];
      data.forEach(a => {
        labels.push(a._id.labels);
       count.push(a.count);
      });
      
		  res.send({labels,count});
      console.log("getProfileCountMonthlyByStaffId by staff_id success");
  }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving getProfileCountMonthlyByStaffId."
      });
  });
};

exports.findAll = (req, res) => {
	 console.log("findAll Start");
	  
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { name: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{};
  Profile_counter.paginate(condition, { offset, limit , sort})
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
          err.message || "Some error occurred while retrieving getProfileCountByStaffId."
      });
    });
};

