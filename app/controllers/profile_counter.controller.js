 
const db = require("../models");
const Profile_counter = db.profile_counter;
var ObjectId = require('mongodb').ObjectId; 
 const readXlsxFile = require('read-excel-file/node')
const excel = require("exceljs")

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
	{$sort:{"_id":-1}}	,
	{ $limit : 7 },
	{$sort:{"_id":1}}	,
	  
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
	{$sort:{"_id":-1}}	,
	{ $limit : 12 },
	{$sort:{"_id":1}	},
	  
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
  var  sort = orderBy? {[orderBy] : -1 }:{ createdAt: -1};
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

exports.downloadStaffLogExcel =  (req, res) => {
  console.log("entered Profile_counter.downloadStaffLogExcel");
  const populate=['staff_id'];
  
	 const { company_id, uid  } = req.query;
	if (company_id == undefined || company_id =="" || uid=="" || uid == undefined) {
		  return res.status(400).send("ERROR");
		}
	 
  Profile_counter.find({ company_id: company_id }).populate(populate)
  .then((objs) => {
   
	//prepare excel Array
	let profCnts = [];

	
		objs.forEach((obj) => {
			
			if (!obj['staff_id'])
			        return;
		
			let updateDate=obj.updatedAt.split(' ');
  
			
			
			
			profCnts.push({
			  updatedAtDate: updateDate[0],
			  updatedAtTime: updateDate[1],
			  company_name_eng: obj.staff_id.company_name_eng,
			  company_name_chi: obj.staff_id.company_name_chi,
			  name_eng: obj.staff_id.name_eng,
			  name_chi: obj.staff_id.name_chi,
			  rc_no: obj.staff_id.rc_no,
			  staff_no: obj.staff_id.staff_no,
			  title_eng: obj.staff_id.title_eng,
			  title_chi: obj.staff_id.title_chi,
			  pro_title: obj.staff_id.pro_title,
			  subsidiary_eng: obj.staff_id.subsidiary_eng,
			  subsidiary_chi: obj.staff_id.subsidiary_chi,
			  address_eng: obj.staff_id.address_eng,
			  address_chi: obj.staff_id.address_chi,
			  
		  });
		});
			  
			  
			  //gen excel
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("staffprofilelog");

		worksheet.columns = [
		 
		  { header: "updatedAtDate", key: "updatedAtDate", width: 25 },
		  { header: "updatedAtTime", key: "updatedAtTime", width: 25 },
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
	 
		];

		// Add Array Rows
		worksheet.addRows(profCnts);

		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "staffProfile.xlsx"
		);

		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		});
	
	
    });
	 
	 
};