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
  Staff_log.find(query).sort({_id:-1}).limit(3500).populate(populate)
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
									   field072: data.field072, 
									    field073: data.field073, 
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
	{ header: "Charging_Centre (Affiliate Code)", key: "cc_no", width: 25 },
	{ header: "Application_ID", key: "staff_no", width: 25 },
	{ header: "TRUE (Add_Amend) FALSE (Inactive)", key: "status", width: 25 },
	{ header: "Name (Eng)", key: "fname", width: 25 },
    { header: "Name (Chi)", key: "lname", width: 25 },
	{ header: "Professional designation (Line 1)", key: "pro_title", width: 25 },
	{ header: "Professional designation (Line 2)", key: "field071", width: 25 },
	{ header: "Job Title (Line 1)", key: "title_eng", width: 25 },
	{ header: "Job Title (Line 1) (Chi)", key: "title_chi", width: 25 },
	{ header: "Job Title (Line 2)", key: "title_eng2", width: 25 },
	{ header: "Job Title (Line 2) (Chi)", key: "title_chi2", width: 25 },
	{ header: "Additional Title", key: "field066", width: 25 },
    { header: "Department_Branch Name", key: "dept_eng", width: 25 },
	{ header: "Department_Branch Name (Chi)", key: "dept_chi", width: 25 },
    { header: "Division Name", key: "division_eng", width: 25 },
    { header: "Division Name (Chi)", key: "division_chi", width: 25 },
	{ header: "Company Name 0_(The Bank of East Asia Limited) 1_(Bank of East Asia (Trustees) Limited) 2_(East Asia Futures Limited) 3_(East Asia Property Agency Company Limited) 4_(East Asia Facility Management Limited) 5_(East Asia Securities Company Limited) 6_(BEA Insurance Agency Limited)", key: "company_name_option", width: 25 },
 	{ header: "2nd Company Name", key: "company_name_eng2", width: 25 },
	{ header: "2nd Company Name (Chi)", key: "company_name_chi2", width: 25 },
	 { header: "2nd Company title", key: "field072", width: 25 },
	{ header: "2nd Company title (Chi)", key: "field073", width: 25 },
	{ header: "3rd Company Name", key: "company_name_eng3", width: 25 },
	{ header: "3rd Company Name (Chi)", key: "company_name_chi3", width: 25 },
    { header: "3rd Company title", key: "field069", width: 25 },
	  { header: "3rd Company title (Chi)", key: "field070", width: 25 },
	  { header: "HKMA Reg_No", key: "hkma_no", width: 25 },
	  { header: "HKMA Type 1_Dealing in Securities (True_Yes  False_No)", key: "type1_no", width: 25 },
	  { header: "HKMA Type 4_Advising on Securities (True_Yes  False_No)", key: "type4_no", width: 25 },
	  { header: "HKMA Type 6_Advising on Corporate Finance (True_Yes  False_No)", key: "type6_no", width: 25 },
	  { header: "HKMA Type 9_Asset Management (True_Yes  False_No)", key: "type9_no", width: 25 },
	  { header: "MPF Intermediary Reg_No", key: "mpf_no", width: 25 },
	  { header: "Technical Representative (Agent) Licence No", key: "agent_no", width: 25 },
	  { header: "Insurance Agent Licence No.", key: "insurance_no", width: 25 },
	  { header: "SFC Central Entity No", key: "sfc_no", width: 25 },
	  { header: "SFC Type 1_Dealing in Securities (True_Yes  False_No)", key: "sfc_type1_no", width: 25 },
	  { header: "SFC Type 2_Dealing in Futures Contracts (True_Yes  False_No)", key: "sfc_type2_no", width: 25 },
	  { header: "Bloomberg", key: "bloomberg_info", width: 25 },
	  { header: "Reuters Dealing Code", key: "reuters_code", width: 25 },
	  { header: "Estate Agent Licence (Individual) Licence No", key: "field052", width: 25 },
	  { header: "Property Management Practitioner (Tier 1) Licence Licence No", key: "field054", width: 25 },
	  { header: "Property Management Practitioner (Tier 2) Licence Licence No", key: "field055", width: 25 },
	  { header: "Estate Agent Licence (Company) Licence No", key: "field051", width: 25 },
	  { header: "Property Management Company Licence Licence No", key: "field053", width: 25 },
	  { header: "SWIFT Code", key: "swift_no", width: 25 },
	  { header: "Work Tel_1", key: "work_tel", width: 25 },
	  { header: "Work Tel_2", key: "work_tel2", width: 25 },
	  { header: "Work Tel_3", key: "work_tel3", width: 25 },
	  { header: "Direct Line", key: "direct_tel", width: 25 },
	  { header: "Mobile_1", key: "mobile", width: 25 },
	  { header: "Mobile_2", key: "mobile2", width: 25 },
	  { header: "Mobile_3", key: "mobile3", width: 25 },
	  { header: "China Mobile_1", key: "mobile_china_tel", width: 25 },
	  { header: "China Mobile_2", key: "mobile_china_tel2", width: 25 },
	  { header: "China Mobile_3", key: "mobile_china_tel3", width: 25 },
	  { header: "Merchant Services Hotline_Tel", key: "field068", width: 25 },
	  { header: "Work Email_1", key: "work_email", width: 25 },
	  { header: "Work Email_2", key: "work_email2", width: 25 },
	  { header: "Work Email_3", key: "work_email3", width: 25 },
	  { header: "Facsimile (852)", key: "fax", width: 25 },
	  { header: "Address", key: "address_eng", width: 25 },
	  { header: "Address (Chi)", key: "address_chi", width: 25 },
	  { header: "2nd Address", key: "address_eng2", width: 25 },
	  { header: "2nd Address (Chi)", key: "address_chi2", width: 25 }, 
	  { header: "Website_1", key: "web_link", width: 25 },
      { header: "Website_2", key: "web_link2", width: 25 },
	  { header: "Website_3", key: "web_link3", width: 25 },
	  { header: "Smart Card Option (True_eprofile  False_vcf)", key: "bizcard_option", width: 25 },
	  { header: "QR Code on E-Profile (1_Vcard  2_Align with Card 3_E-Profile 4_VCF)", key: "qrcode_option", width: 25 },
	  { header: "Reserved Field under HKMA Reg No", key: "field056", width: 25 },
	  { header: "Reserved Field under HKMA Reg No", key: "field057", width: 25 },
	  { header: "Reserved Field under HKMA Reg No", key: "field058", width: 25 },
	  { header: "SFC Type 4_Advising on Securities (True_Yes  False_No)", key: "field059", width: 25 },
	  { header: "Reserved Field under SFC Central Entity No", key: "field060", width: 25 },
	  { header: "Reserved Field at the bottom of ABOUT ME page", key: "field065", width: 25 }, 
	  { header: "Reserved Field at the bottom of GET IN TOUCH Page", key: "field067", width: 25 },
	    { header: "Reserved Field at the bottom of Staff Profile", key: "field061", width: 25 },
	  { header: "Reserved Field at the bottom of Staff Profile", key: "field062", width: 25 },
	  { header: "Reserved Field at the bottom of Staff Profile", key: "field063", width: 25 },
	  { header: "Reserved Field at the bottom of Staff Profile", key: "field064", width: 25 }, 
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

 