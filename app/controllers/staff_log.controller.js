const upload = require("../middleware/upload");
 
const db = require("../models");

var ObjectId = require('mongodb').ObjectId; 
const Staff_log = db.staff_log;
const readXlsxFile = require('read-excel-file/node')
const excel = require("exceljs")

const getPagination = (page, size) => {
	const limit = size ? +size : 5;
	const offset = page ? page* limit : 0;
	return { limit, offset };
};

let uploadFiles=""; 

 
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  console.log("entered Stafflog.findall");
  const populate=['company_id','createdBy','updatedBy'];
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { name_eng: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{ updatedAt:-1,_id:1  };
 
    let queryArray=[];
  let query={};  
		
	 
  
  Staff_log.paginate(query, { populate,offset, limit , sort})
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
 

exports.downloadStaffLogExcel =  (req, res) => {
  console.log("entered stafflog.downloadStaffLogExcel");
  const populate=['company_id','createdBy','updatedBy'];
  
	 const { company_id, uid  } = req.query;
	if (company_id == undefined || company_id =="" || uid=="" || uid == undefined) {
		  return res.status(400).send("ERROR");
		}
	 
  Staff_log.find({ company_id: company_id }).populate(populate)
  .then((objs) => {
   
    //prepare excel Array
	 let staffs = [];

    objs.forEach((obj) => {
		 
		 
		if (!obj['updatedBy'])
		{ 
			 		
			obj.updatedBy=ObjectId('639d828082de296c1eabf6a7');
			if (!obj.hasOwnProperty('updatedBy.username'))	
			obj.updatedBy.username='No username';
			
		}
		 	let updateDate=obj.updatedAt.split(' ');
      staffs.push({
		  updatedAtDate: updateDate[0],
		  updatedAtTime: updateDate[1],
		  updatedBy: obj.updatedBy.username,
		  company_name_eng: obj.company_name_eng,
		  company_name_chi: obj.company_name_chi,
		  name_eng: obj.name_eng,
		  name_chi: obj.name_chi,
		  rc_no:obj.rc_no,
		  staff_no: obj.staff_no,
		  title_eng:obj.title_eng,
		  title_chi:obj.title_chi,
		  pro_title:obj.pro_title,
		  subsidiary_eng: obj.subsidiary_eng,
		  subsidiary_chi: obj.subsidiary_chi,
		  address_eng: obj.address_eng,
		  address_chi: obj.address_chi,
		  work_tel: obj.work_tel,
		  work_tel2: obj.work_tel2,
		  work_tel3: obj.work_tel3,
		  direct_tel: obj.direct_tel,
		  direct_tel2: obj.direct_tel2,
		  direct_tel3: obj.direct_tel3,
		  mobile_tel: obj.mobile_tel,
		  mobile_tel2: obj.mobile_tel2,
		  mobile_tel3: obj.mobile_tel3,
		  mobile_tel4: obj.mobile_tel4,
		  mobile_tel5: obj.mobile_tel5,
		  fax_no: obj.fax_no,
		  fax_no2: obj.fax_no2,
		  fax_no3: obj.fax_no3,
		  fax_no4: obj.fax_no4,
		  fax_no5: obj.fax_no5,
		  reuters:obj.reuters,
          work_email: obj.work_email,
          agent_no: obj.agent_no,
          broker_no: obj.broker_no,
		  
		  mpf_no:obj.mpf_no,
		  hkma_no:obj.hkma_no,
		  hkma_eng:obj.hkma_eng,
		  hkma_chi:obj.hkma_chi,
		  
		  smartcard_uid:obj.smartcard_uid,
		  bizcard_option: obj.bizcard_option,
		  status:obj.status,
		
         
      });
    });
	
	//gen excel
	   let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffslog");

    worksheet.columns = [
	 
		{ header: "updatedAtDate", key: "updatedAtDate", width: 25 },
		  { header: "updatedAtTime", key: "updatedAtTime", width: 25 },
      { header: "updatedBy", key: "updatedBy", width: 25 },
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
	  { header: "work_tel", key: "work_tel", width: 25 },
	  { header: "direct_tel", key: "direct_tel", width: 25 },
	  { header: "mobile_tel", key: "mobile_tel", width: 25 },
	  { header: "mobile_tel2", key: "mobile_tel2", width: 25 },
	  { header: "fax_no", key: "fax_no", width: 25 },
	  { header: "fax_no2", key: "fax_no2", width: 25 },
	  { header: "reuters", key: "reuters", width: 25 },
	  { header: "work_email", key: "work_email", width: 25 },
	  { header: "agent_no", key: "agent_no", width: 25 },
	  { header: "broker_no", key: "broker_no", width: 25 },
	  { header: "mpf_no", key: "mpf_no", width: 25 },
	  { header: "hkma_no", key: "hkma_no", width: 25 },
	  { header: "hkma_eng", key: "hkma_eng", width: 25 },
	  { header: "hkma_chi", key: "hkma_chi", width: 25 },
	   
	  { header: "smartcard_uid", key: "smartcard_uid", width: 25 },
	  { header: "bizcard_option", key: "bizcard_option", width: 25 },
	  { header: "status", key: "status", width: 25 },
    ];

    // Add Array Rows
    worksheet.addRows(staffs);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "staffs.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
	//gen excel 
  });
   
};

 