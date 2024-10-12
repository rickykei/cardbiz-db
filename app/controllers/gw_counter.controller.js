 
const db = require("../models");
const GW_counter = db.gw_counter;
var ObjectId = require('mongodb').ObjectId; 
const readXlsxFile = require('read-excel-file/node')
const excel = require("exceljs")

 
 
exports.downloadStaffGWExcel =  (req, res) => {
  console.log("entered GW_counter.downloadGWCounterExcel");
  const populate=['staff_id'];
    let query={};
	let nfc=0;
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
	  GW_counter.find(query).populate(populate)
  .then((objs) => {
   
	//prepare excel Array
	let profCnts = [];

	
		objs.forEach((obj) => {
			
			if (!obj['staff_id'])
			        return;
		
			let updateDate=obj.updatedAt.split(' ');
  
			
			
			if (nfc==0){
			profCnts.push({
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
				profCnts.push({
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
		let worksheet = workbook.addWorksheet("staffGWlog");


		if (nfc==0){
		worksheet.columns = [
		 
			  { header: "updatedAtDate", key: "updatedAtDate", width: 25 },
		  { header: "updatedAtTime", key: "updatedAtTime", width: 25 },
		  { header: "company_name_eng", key: "company_name_eng", width: 25 },
		  { header: "company_name_chi", key: "company_name_chi", width: 25 },
		  { header: "first_name", key: "fname", width: 25 },
		  { header: "last_name", key: "lname", width: 25 },
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
			{ header: "first_name", key: "fname", width: 25 },
			{ header: "last_name", key: "lname", width: 25 },
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
		worksheet.addRows(profCnts);

		res.setHeader(
		  "Content-Type",
		  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
		  "Content-Disposition",
		  "attachment; filename=" + "staffGW.xlsx"
		);

		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		});
	
	
    });
	 
	 
};
