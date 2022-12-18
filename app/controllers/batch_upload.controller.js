const db = require("../models");
const Staffs = db.staffs;
const readXlsxFile = require('read-excel-file/node')
 var ObjectId = require('mongodb').ObjectId; 
const excel = require("exceljs");

exports.uploadStaffExcel =  async (req, res) => {
	try {
		let path =  __basedir + "/uploads/" + req.file.filename;
 	 
		if (req.file == undefined) {
		  return res.status(400).send("Please upload an excel file!");
		}
	let company_id=req.body.company_id;
	 var staffs = [];
	 var xls_staffs = [];
      var new_staffs = [];
	  var old_staffs = [];
	  
	  
   xls_staffs=await readXlsxFile(path).then((rows) => {
		 
      // skip header
      rows.shift();
 
     for(row of rows){
		for (let i = 0; i < 26; i++) {
			  if (row[i]==null || row[i]==undefined)
				  row[i]="";
			} 
        var staff = {
		  company_id: company_id,
		  name_eng: row[0],
		  name_chi: row[1],
		  rc_no: row[2],
		  staff_no: row[3],
          title_eng: row[4],
          title_chi: row[5],
          pro_title: row[6],
		  subsidiary_eng:row[7],
		  subsidiary_chi:row[8],
		  address_eng:row[9],
		  address_chi:row[10],
		  work_tel:row[11],
		  direct_tel:row[12],
		  mobile_tel:row[13],
		  fax_no:row[14],
		  reuters:row[15],
		  work_email:row[16],
		  agent_no:row[17],
		  broker_no:row[18],
		  mpf_no:row[19],
		  hkma_no:row[20],
		  hkma_eng:row[21],
		  hkma_chi :row[22],
		  smartcard_uid:row[23],
		  bizcard_option: row[24],
		  status:row[25],
        };

        staffs.push(staff);
		
      };
	  
	  
	   return staffs;
	   }
	);  
	 
	  for (var s of xls_staffs){
		  var query ={};
		   query.company_id =  ObjectId(company_id);
		   query.staff_no =  s.staff_no;
		let mongoDocument =  await Staffs.findOne(query).exec();
		
		if (mongoDocument!=undefined)
		{
			s.company_id=company_id;
			
			old_staffs.push(s);
			console.log("old doc id"+mongoDocument.id);
			await Staffs.findByIdAndUpdate(mongoDocument.id, s, { useFindAndModify: true });
		}else{
			s.company_id=company_id;
			new_staffs.push(s);
			
		}
	  }
	
	console.log("new"+new_staffs.length);
	console.log("old"+old_staffs.length);
	  	 
		  
	 Staffs.insertMany(new_staffs).then(function(){
			console.log("Data inserted")  // Success
			res.send({message: "done"});
		}).catch(function(error){
			console.log(error)      // Failure
		});
			 
	 res.send({message: "done",old_staffs,new_staffs});
  
	  
   
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
 
exports.uploadStaffExcelAddOnly =  (req, res) => {
	let path =  __basedir + "/uploads/" + req.file.filename;
 	
    try {
		if (req.file == undefined) {
		  return res.status(400).send("Please upload an excel file!");
		}
	let company_id=req.body.company_id;
    readXlsxFile(path).then((rows) => {
		
	  var staffs = [];
      var new_staffs = [];
	  var old_staffs = [];
      // skip header
      rows.shift();
 
      rows.forEach((row) => {
        var staff = {
          company_id: company_id,
		  name_eng: row[0],
		  name_chi: row[1],
		  rc_no: row[2],
		  staff_no: row[3],
          title_eng: row[4],
          title_chi: row[5],
          pro_title: row[6],
		  subsidiary_eng:row[7],
		  subsidiary_chi:row[8],
		  address_eng:row[9],
		  address_chi:row[10],
		  work_tel:row[11],
		  direct_tel:row[12],
		  mobile_tel:row[13],
		  fax_no:row[14],
		  reuters:row[15],
		  work_email:row[16],
		  agent_no:row[17],
		  broker_no:row[18],
		  mpf_no:row[19],
		  hkma_no:row[20],
		  hkma_eng:row[21],
		  hkma_chi :row[22],
		  smartcard_uid:row[23],
		  bizcard_option: row[24],
		  status:row[25],
        };

        staffs.push(staff);
		
      });
	  	 
	 Staffs.insertMany(staffs).then(function(){
    console.log("Data inserted")  // Success
	res.send({message: "done"});
}).catch(function(error){
    console.log(error)      // Failure
});
	 
	 
    });  
	  
   
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
 
exports.downloadStaffExcel =  (req, res) => {
	 const { company_id  } = req.query;
	if (company_id == undefined || company_id =="") {
		  return res.status(400).send("ERROR");
		}
	 
  Staffs.find({ company_id: company_id }).then((objs) => {
    let staffs = [];

    objs.forEach((obj) => {
      staffs.push({
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
		  direct_tel: obj.direct_tel,
		  mobile_tel: obj.mobile_tel,
		  fax_no: obj.fax_no,
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

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffs");

    worksheet.columns = [
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
	  { header: "fax_no", key: "fax_no", width: 25 },
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
  });
};
