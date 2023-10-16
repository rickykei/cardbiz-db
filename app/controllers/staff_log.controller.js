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
  const populate=['company_id','smartcard_uid','createdBy','updatedBy'];
  const { company_id, uid  } = req.query;
   let query={};
   
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
  Staff_log.find(query).populate(populate)
  .then((objs) => {
   
    //prepare excel Array
	 let staffs = [];

    objs.forEach((data) => {
		 
		 
		if (!data['updatedBy'])
		{ 
			 		
			data.updatedBy=ObjectId('639d828082de296c1eabf6a7');
			if (!data.hasOwnProperty('updatedBy.username'))	
			data.updatedBy.username='No username';
			
		}
		 	let updateDate=data.updatedAt.split(' ');
      staffs.push({
		  updatedAtDate: updateDate[0],
		  updatedAtTime: updateDate[1],
		  updatedBy: data.updatedBy.username,
		 company_id: data.company_id,
									
									 company_name_option: data.company_name_option,
								    company_name_eng: data.company_name_eng,
									company_name_chi: data.company_name_chi,
									company_name_eng2: data.company_name_eng2,
									company_name_chi2: data.company_name_chi2,
									company_name_eng3: data.company_name_eng3,
									company_name_chi3: data.company_name_chi3,
									cc_no:data.cc_no,
									staff_no: data.staff_no,
									fname: data.fname,
									lname: data.lname,
									  title_eng: data.title_eng,
									  title_chi: data.title_chi,
									   title_eng2: data.title_eng2,
									  title_chi2: data.title_chi2,
									  pro_title: data.pro_title,
									  division_eng: data.division_eng,
									  division_chi: data.division_chi,
									  dept_eng: data.dept_eng,
									  dept_chi: data.dept_chi,
									  address_eng: data.address_eng,
									  address_chi: data.address_chi,
									  address_eng2: data.address_eng2,
									  address_chi2: data.address_chi2,
									  work_tel: data.work_tel,
									  work_tel2: data.work_tel2,
									  work_tel3: data.work_tel3,
									  direct_tel: data.direct_tel,
									  direct_tel2: data.direct_tel2,
									  direct_tel3: data.direct_tel3,
									  mobile: data.mobile,
									  mobile2: data.mobile2,
									  mobile3: data.mobile3,
									  mobile_china_tel: data.mobile_china_tel,
									  mobile_china_tel2: data.mobile_china_tel2,
									  mobile_china_tel3: data.mobile_china_tel3,
									  fax: data.fax,
									  swift_no: data.swift_no,
									  work_email: data.work_email,
									  work_email2: data.work_email2,
									  work_email3: data.work_email3,
									  web_link: data.web_link,
									  web_link2: data.web_link2,
									  web_link3: data.web_link3,
									  web_link_label: data.web_link_label,
									  web_link_label2: data.web_link_label2,
									  web_link_label3: data.web_link_label3,
									  agent_no: data.agent_no,
									  insurance_no: data.insurance_no,
									  mpf_no: data.mpf_no,
									  hkma_no: data.hkma_no,
									  type1_no: data.type1_no,
									  type4_no: data.type4_no,
									  type6_no: data.type6_no,
									  type9_no: data.type9_no,
									  reuters_code: data.reuters_code,
									  bloomberg_info: data.bloomberg_info,
									  sfc_no: data.sfc_no,
									   sfc_type1_no: data.sfc_type1_no,
									  sfc_type2_no: data.sfc_type2_no,
									  field051: data.field051,
									  field052: data.field052,
									  field053: data.field053,
									  field054: data.field054,
									  field055: data.field055,
									  field056: data.field056,
									  field057: data.field057,
									  field058: data.field058,
									  field059: data.field059,
									  field060: data.field060,
									  field061: data.field061,
									  field062: data.field062,
									  field063: data.field063,
									  field064: data.field064,
									  field065: data.field065,
									  field066: data.field066,
									  field067: data.field067,
									  field068: data.field068,
									  field069: data.field069,
									  field070: data.field070, 
									  field071: data.field071, 
									  
									  note_timestamp: data.note_timestamp,
									smartcard_uid: data.smartcard_uid?data.smartcard_uid.uid:null,
									bizcard_option: data.bizcard_option,
									dig_card_in_vcf: data.dig_card_in_vcf,
									qrcode_option: data.qrcode_option,
									status:data.status, 
      });
    });
	
	//gen excel
	   let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffslog");

    worksheet.columns = [
	 
		{ header: "updatedAtDate", key: "updatedAtDate", width: 25 },
		  { header: "updatedAtTime", key: "updatedAtTime", width: 25 },
      { header: "updatedBy", key: "updatedBy", width: 25 },
		 { header: "app_id", key: "staff_no", width: 25 },
		{ header: "company_name_option", key: "company_name_option", width: 25 },
	{ header: "company_name_eng", key: "company_name_eng", width: 25 },
	{ header: "company_name_chi", key: "company_name_chi", width: 25 },
	{ header: "company_name_eng2", key: "company_name_eng2", width: 25 },
	{ header: "company_name_chi2", key: "company_name_chi2", width: 25 },
	{ header: "company_name_eng3", key: "company_name_eng3", width: 25 },
	{ header: "company_name_chi3", key: "company_name_chi3", width: 25 },

      { header: "cc_no", key: "cc_no", width: 25 },
      
	  { header: "name_eng", key: "fname", width: 25 },
      { header: "name_chi", key: "lname", width: 25 },
      { header: "title_eng", key: "title_eng", width: 25 },
	  { header: "title_chi", key: "title_chi", width: 25 },
	  { header: "title_eng2", key: "title_eng2", width: 25 },
	  { header: "title_chi2", key: "title_chi2", width: 25 },
	  { header: "pro_title", key: "pro_title", width: 25 },
	  { header: "pro_title2", key: "field070", width: 25 },
      { header: "division_eng", key: "division_eng", width: 25 },
	  { header: "division_chi", key: "division_chi", width: 25 },
	  { header: "dept_eng", key: "dept_eng", width: 25 },
	  { header: "dept_chi", key: "dept_chi", width: 25 },
	  { header: "address_eng", key: "address_eng", width: 25 },
	  { header: "address_chi", key: "address_chi", width: 25 },
	  { header: "address_eng2", key: "address_eng2", width: 25 },
	  { header: "address_chi2", key: "address_chi2", width: 25 },
	  { header: "work_tel", key: "work_tel", width: 25 },
	  { header: "work_tel2", key: "work_tel2", width: 25 },
	  { header: "work_tel3", key: "work_tel3", width: 25 },
	  { header: "direct_tel", key: "direct_tel", width: 25 },
	  { header: "direct_tel2", key: "direct_tel2", width: 25 },
	  { header: "direct_tel3", key: "direct_tel3", width: 25 },
	  { header: "mobile_tel", key: "mobile_tel", width: 25 },
	  { header: "mobile_tel2", key: "mobile_tel2", width: 25 },
	  { header: "mobile_tel3", key: "mobile_tel3", width: 25 },
	  { header: "mobile_china_tel", key: "mobile_china_tel", width: 25 },
	  { header: "mobile_china_tel2", key: "mobile_china_tel2", width: 25 },
	  { header: "mobile_china_tel3", key: "mobile_china_tel3", width: 25 },
	  { header: "fax_no", key: "fax_no", width: 25 },
	  { header: "swift_no", key: "swift_no", width: 25 },
	  { header: "work_email", key: "work_email", width: 25 },
	  { header: "work_email2", key: "work_email2", width: 25 },
	  { header: "work_email3", key: "work_email3", width: 25 },
	  { header: "web_link", key: "web_link", width: 25 },
	  { header: "web_link_label", key: "web_link_label", width: 25 },
	  { header: "web_link2", key: "web_link2", width: 25 },
	  { header: "web_link_label2", key: "web_link_label2", width: 25 },
	  { header: "web_link", key: "web_link", width: 25 },
	 { header: "web_link_label3", key: "web_link_label3", width: 25 },
	  { header: "agent_no", key: "agent_no", width: 25 },
	  { header: "insurance_no", key: "insurance_no", width: 25 },
	  { header: "mpf_no", key: "mpf_no", width: 25 },
	  { header: "hkma_no", key: "hkma_no", width: 25 },
	  { header: "hkma_type1_no", key: "type1_no", width: 25 },
	  { header: "hkma_type4_no", key: "type4_no", width: 25 },
	  { header: "hkma_type6_no", key: "type6_no", width: 25 },
	  { header: "hkma_type9_no", key: "type9_no", width: 25 },
	  { header: "reuters_code", key: "reuters_code", width: 25 },
	  { header: "bloomberg_info", key: "bloomberg_info", width: 25 },
	  { header: "sfc_no", key: "sfc_no", width: 25 },
	   { header: "sfc_type1_no", key: "sfc_type1_no", width: 25 },
	  { header: "sfc_type2_no", key: "sfc_type2_no", width: 25 },
	  { header: "estate_agent_company_no", key: "field051", width: 25 },
	  { header: "estate_agent_individual_no", key: "field052", width: 25 },
	  { header: "property_management_company_no", key: "field053", width: 25 },
	  { header: "property_tier1_no", key: "field054", width: 25 },
	  { header: "property_tier2_no", key: "field055", width: 25 },
	  { header: "additional_info", key: "field056", width: 25 },
	  { header: "additional_info2", key: "field057", width: 25 },
	  { header: "additional_info3", key: "field058", width: 25 },
	  { header: "additional_info4", key: "field059", width: 25 },
	  { header: "additional_info5", key: "field060", width: 25 },
	  { header: "additional_info6", key: "field061", width: 25 },
	  { header: "additional_info7", key: "field062", width: 25 },
	  { header: "additional_info8", key: "field063", width: 25 },
	  { header: "additional_info9", key: "field064", width: 25 },
	  { header: "additional_info10", key: "field065", width: 25 },
	  { header: "additional_info11", key: "field066", width: 25 },
	  { header: "additional_info12", key: "field067", width: 25 },
	  { header: "mshotline_tel", key: "field068", width: 25 },
	  { header: "mshotline_tel2", key: "field069", width: 25 },
	  { header: "mshotline_tel3", key: "field070", width: 25 },
	   
	  { header: "note_timestamp", key: "note_timestamp", width: 25 },
	  { header: "smartcard_uid", key: "smartcard_uid", width: 25 },
	  { header: "bizcard_option", key: "bizcard_option", width: 25 },
	  { header: "dig_card_in_vcf", key: "dig_card_in_vcf", width: 25 },
	   { header: "qrcode_option", key: "qrcode_option", width: 25 },
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

 