const db = require("../models");
const Vcf_counter = db.vcf_counter;
var ObjectId = require('mongodb').ObjectId; 
 const readXlsxFile = require('read-excel-file/node')
const excel = require("exceljs")

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page* limit : 0;
  return { limit, offset };
};

// Find vcfCounter code list
exports.getVcfCountByStaffId =  (req, res) => {
  console.log("getVcfCounter Start");

  const id = req.query.staff_id;
   
  console.log("find staff_id = "+ObjectId(id));
  
  Vcf_counter.aggregate([
	{
    $match: {staff_id: ObjectId(id)}
  },
  {
	  $group:{
			_id: {staff_id: "$staff_id",
			labels: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" ,timezone: "Asia/Hong_Kong"} },
			},
        count:{$sum:1}
			}
	},
	{$sort:{"_id":-1}	},
	{ $limit : 7 },
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
      console.log("getVcfCounter by staff_id success");
  }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vcfCounter."
      });
  });
};

exports.getVcfCountMonthlyByStaffId =  (req, res) => {
  console.log("getVcfCounter Start");

  const id = req.query.staff_id;
   
  console.log("find staff_id = "+ObjectId(id));
  
  Vcf_counter.aggregate([
	{
    $match: {staff_id: ObjectId(id)}
  },
  {
	  $group:{
			_id: {staff_id: "$staff_id",
			labels: { $dateToString: { format: "%Y-%m", date: "$createdAt" ,timezone: "Asia/Hong_Kong"} },
			},
        count:{$sum:1}
			}
	},
	{$sort:{"_id":-1}	}
		,
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
      console.log("getVcfCounter by staff_id success");
  }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vcfCounter."
      });
  });
};
exports.findAll = (req, res) => {
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { name: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{};
  Vcf_counter.paginate(condition, { offset, limit , sort})
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

exports.downloadStaffLogExcel =  (req, res) => {
  console.log("entered  Vcf_counter.downloadStaffLogExcel");
  const populate=['staff_id'];
  let nfc=0;
  let query={};
	 const { company_id, uid  } = req.query;
	if (company_id == undefined || company_id =="" || uid=="" || uid == undefined) {
		  return res.status(400).send("ERROR");
		}
	   if (company_id!="63142fd5b54bdbb18f556016")
	 {
	 
			query.company_id = ObjectId(company_id);
	 
		console.log("non nfc");
	 }else{
		  nfc=1;
		 console.log("nfc");
	 }
	 
	  console.log(query);
  Vcf_counter.find(query).populate(populate)
  .then((objs) => {
   
	//prepare excel Array
	let vcfCnts = [];
	

		objs.forEach((obj) => {
			
			 
			let updateDate=obj.updatedAt.split(' ');

			if (nfc==0)
			{
					vcfCnts.push({
								updatedAtDate: updateDate[0],
					updatedAtTime: updateDate[1],
						company_name_eng: obj.staff_id?.company_name_eng==undefined?"":obj.staff_id.company_name_eng,
					company_name_chi: obj.staff_id?.company_name_chi==undefined?"":obj.staff_id.company_name_chi,
					fname: obj.staff_id?.fname==undefined?"":obj.staff_id.fname,
					lname: obj.staff_id?.lname==undefined?"":obj.staff_id.lname,
					position: obj.staff_id?.position==undefined?"":obj.staff_id.position,
					address: obj.staff_id?.address==undefined?"":obj.staff_id.address,
					address2: obj.staff_id?.address2==undefined?"":obj.staff_id.address2,
					address3: obj.staff_id?.address3==undefined?"":obj.staff_id.address3,
					address4: obj.staff_id?.address4==undefined?"":obj.staff_id.address4,
					staff_no: obj.staff_id?.staff_no==undefined?"":obj.staff_id.staff_no,
					division : obj.staff_id?.division==undefined?"":obj.staff_id.division,
					department: obj.staff_id?.department==undefined?"":obj.staff_id.department,
					country: obj.staff_id?.country==undefined?"":obj.staff_id.country,
				 
					
				});
			}else{
						vcfCnts.push({
						updatedAtDate: updateDate[0],
						updatedAtTime: updateDate[1],
						company_name_eng: obj.staff_id?.company_name_eng==undefined?"":obj.staff_id.company_name_eng,
						company_name_chi: obj.staff_id?.company_name_chi==undefined?"":obj.staff_id.company_name_chi,
						fname: obj.staff_id?.fname==undefined?"":obj.staff_id.fname,
						lname: obj.staff_id?.lname==undefined?"":obj.staff_id.lname,
						position: obj.staff_id?.position==undefined?"":obj.staff_id.position,
						address: obj.staff_id?.address==undefined?"":obj.staff_id.address,
						address2: obj.staff_id?.address2==undefined?"":obj.staff_id.address2,
						address3: obj.staff_id?.address3==undefined?"":obj.staff_id.address3,
						address4: obj.staff_id?.address4==undefined?"":obj.staff_id.address4,
						staff_no: obj.staff_id?.staff_no==undefined?"":obj.staff_id.staff_no,
						division : obj.staff_id?.division==undefined?"":obj.staff_id.division,
						department: obj.staff_id?.department==undefined?"":obj.staff_id.department,
						country: obj.staff_id?.country==undefined?"":obj.staff_id.country,
						ip: obj.ip==undefined?"":obj.ip,
						user_agent:obj.user_agent==undefined?"":obj.user_agent,

						});
			}
		});
			   
		//gen excel
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("staffvcflog");

		if (nfc==0){

				
				worksheet.columns = [
				
					{ header: "updatedAtDate", key: "updatedAtDate", width: 25 },
				{ header: "updatedAtTime", key: "updatedAtTime", width: 25 },
				{ header: "company_name_eng", key: "company_name_eng", width: 25 },
				{ header: "company_name_chi", key: "company_name_chi", width: 25 },
					{ header: "english_name", key: "fname", width: 25 },
				{ header: "chinese_name", key: "lname", width: 25 },
				{ header: "position", key: "position", width: 25 },
				{ header: "address", key: "address", width: 25 },
				{ header: "address2", key: "address2", width: 25 },
				{ header: "address3", key: "address3", width: 25 },
				{ header: "address4", key: "address4", width: 25 },
				{ header: "staff_no", key: "staff_no", width: 25 },
				{ header: "division ", key: "division", width: 25 },
				{ header: "department", key: "department", width: 25 },
				{ header: "country", key: "country", width: 25 },
			 
			
				];
		}else{

			worksheet.columns = [
				
				{ header: "updatedAtDate", key: "updatedAtDate", width: 25 },
			{ header: "updatedAtTime", key: "updatedAtTime", width: 25 },
			{ header: "company_name_eng", key: "company_name_eng", width: 25 },
			{ header: "company_name_chi", key: "company_name_chi", width: 25 },
				{ header: "english_name", key: "fname", width: 25 },
			{ header: "chinese_name", key: "lname", width: 25 },
			{ header: "position", key: "position", width: 25 },
			{ header: "address", key: "address", width: 25 },
			{ header: "address2", key: "address2", width: 25 },
			{ header: "address3", key: "address3", width: 25 },
			{ header: "address4", key: "address4", width: 25 },
			{ header: "staff_no", key: "staff_no", width: 25 },
			{ header: "division ", key: "division", width: 25 },
			{ header: "department", key: "department", width: 25 },
			{ header: "country", key: "country", width: 25 },
			{ header: "ip", key: "ip", width: 25 },
			{ header: "user_agent", key: "user_agent", width: 25 },
			];
		}

		// Add Array Rows
		worksheet.addRows(vcfCnts);

		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "staffsVcf.xlsx"
		);

		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		});
	
	
    });
	 
	 
};
