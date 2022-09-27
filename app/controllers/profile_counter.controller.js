const db = require("../models");
const Profile_counter = db.profile_counter;
var ObjectId = require('mongodb').ObjectId; 

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page* limit : 0;
  return { limit, offset };
};

// Find vcfCounter code list
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
			_id: {staff_id: "$staff_id",
			      year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
				},
        count:{$sum:1}
			}
	},
	{$sort:{"_id":1}}
	  
  ]).then((data) => {
    console.log(data);
  
    var labels=[];
    var count=[];
      data.forEach(a => {
        labels.push(a._id.year+'/'+a._id.month+'/'+a._id.day);
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


exports.findAll = (req, res) => {
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

