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
		  
		 console.log("nfc");
	 }
	 
	  console.log(query);
  Vcf_counter.find(query).populate(populate)
  .then((objs) => {
   
	//prepare excel Array
	let vcfCnts = [];
	

		objs.forEach((obj) => {
			
			 
			let updateDate=obj.updatedAt.split(' ');
			vcfCnts.push({
						  updatedAtDate: updateDate[0],
			  updatedAtTime: updateDate[1],
				  company_name_option: obj.staff_id?.company_name_option==undefined?"":obj.staff_id.company_name_option,
			  company_name_eng2: obj.staff_id?.company_name_eng2==undefined?"":obj.staff_id.company_name_eng2,
			  company_name_chi2: obj.staff_id?.company_name_chi2==undefined?"":obj.staff_id.company_name_chi2,
			  company_name_eng3: obj.staff_id?.company_name_eng3==undefined?"":obj.staff_id.company_name_eng3,
			  company_name_chi3: obj.staff_id?.company_name_chi3==undefined?"":obj.staff_id.company_name_chi3,
			  cc_no: obj.staff_id?.cc_no==undefined?"":obj.staff_id.cc_no,
			  staff_no: obj.staff_id?.staff_no==undefined?"":obj.staff_id.staff_no,
			  fname: obj.staff_id?.fname==undefined?"":obj.staff_id.fname,
			  lname: obj.staff_id?.lname==undefined?"":obj.staff_id.lname,
			  title_eng: obj.staff_id?.title_eng==undefined?"":obj.staff_id.title_eng,
			  title_chi: obj.staff_id?.title_chi==undefined?"":obj.staff_id.title_chi,
			  title_eng2: obj.staff_id?.title_eng2==undefined?"":obj.staff_id.title_eng2,
			  title_chi2: obj.staff_id?.title_chi2==undefined?"":obj.staff_id.title_chi2,
			  division_eng: obj.staff_id?.division_eng==undefined?"":obj.staff_id.division_eng,
			  division_chi : obj.staff_id?.division_chi==undefined?"":obj.staff_id.division_chi,
			    dept_eng: obj.staff_id?.dept_eng==undefined?"":obj.staff_id.dept_eng,
				  dept_chi: obj.staff_id?.dept_chi==undefined?"":obj.staff_id.dept_chi,
				  address_eng: obj.staff_id?.address_eng==undefined?"":obj.staff_id.address_eng,
			  address_chi: obj.staff_id?.address_chi==undefined?"":obj.staff_id.address_chi,
			  address_eng2: obj.staff_id?.address_eng2==undefined?"":obj.staff_id.address_eng2,
			  address_chi2: obj.staff_id?.address_chi2==undefined?"":obj.staff_id.address_chi2, 
			  
		  });
		});
			  
			  
			  //gen excel
		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("staffvcflog");

		worksheet.columns = [
		 
		 	  { header: "updatedAtDate", key: "updatedAtDate", width: 25 },
		  { header: "updatedAtTime", key: "updatedAtTime", width: 25 },
		 	   { header: "Company Name 0_(The Bank of East Asia Limited) 1_(Bank of East Asia (Trustees) Limited) 2_(East Asia Futures Limited) 3_(East Asia Property Agency Company Limited) 4_(East Asia Facility Management Limited) 5_(East Asia Securities Company Limited) 6_(BEA Insurance Agency Limited)", key: "company_name_option", width: 25 },
		  { header: "2nd Company Name", key: "company_name_eng2", width: 25 },
		  { header: "2nd Company Name (Chi)", key: "company_name_chi2", width: 25 },
		  { header: "3rd Company Name", key: "company_name_eng3", width: 25 },
		  { header: "3rd Company Name (Chi)", key: "company_name_chi3", width: 25 },
		  { header: "Charging_Centre (Affiliate Code)", key: "cc_no", width: 25 },
		  { header: "Application_ID", key: "staff_no", width: 25 },
		  { header: "Name (Eng)", key: "fname", width: 25 },
		  { header: "Name (Chi)", key: "lname", width: 25 },
		   { header: "Job Title (Line 1)", key: "title_eng", width: 25 },
		    { header: "Job Title (Line 1) (Chi)", key: "title_chi", width: 25 },
			 { header: "Job Title (Line 2)", key: "title_eng2", width: 25 },
		 { header: "Job Title (Line 2) (Chi)", key: "title_chi2", width: 25 },
			 { header: "Division Name", key: "division_eng", width: 25 },
			{ header: "Division Name (Chi)", key: "division_chi", width: 25 },
		  { header: "Department_Branch Name", key: "dept_eng", width: 25 },
		   { header: "Department_Branch Name (Chi)", key: "dept_chi", width: 25 },
		  { header: "Address (Eng)", key: "address_eng", width: 25 },
		  { header: "Address (Chi)", key: "address_chi", width: 25 },
		  { header: "2nd Address", key: "address_eng2", width: 25 },
		  { header: "2nd Address (Chi)", key: "address_chi2", width: 25 },
		  { header: "division ", key: "division", width: 25 },
		  { header: "department", key: "department", width: 25 },
		  { header: "country", key: "country", width: 25 },
	 
		];

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
