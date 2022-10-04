const db = require("../models");
const Staffs = db.staffs;
const readXlsxFile = require('read-excel-file/node')
 var ObjectId = require('mongodb').ObjectId; 
const excel = require("exceljs");


exports.uploadStaffExcel =  (req, res) => {
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
          fname: row[0],
		  company_id: company_id,
		  company_name:row[1],
          work_email: row[2],
          home_email: row[3],
          other_email: row[4],
		  position:row[5],
		  work_tel:row[6],
		  work_tel2:row[7],
		  mobile:row[8],
		  mobile2:row[9],
		  home_tel:row[10],
		  fax:row[11],
		  web_link:row[12],
		  web_link2:row[13],
		  web_link3:row[14],
		  web_link4:row[15],
		  web_link5:row[16],
		  web_link6:row[17],
		  address:row[18],
		  address2:row[19],
		  division :row[20],
		  department:row[21],
		  country:row[22],
		  bio:row[23],
		  company_website_url:row[24],
		  more_info_tab_url:row[25],
		  facebook_url:row[26],
		  instagram_url:row[27],
		  whatsapp_url:row[28],
		  linkedin_url:row[29],
		  youtube_url:row[30],
		  twitter_url:row[31],
		  wechat_id:row[32],
		  smartcard_uid:row[33],
		  bizcard_option: row[34],
		  status:row[35],
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
		  fname: obj.fname,
		  company_name:obj.company_name,
          work_email: obj.work_email,
          home_email: obj.home_email,
          other_email: obj.other_email,
		  position:obj.position,
		  work_tel:obj.work_tel,
		  work_tel2:obj.work_tel2,
		  mobile:obj.mobile,
		  mobile2:obj.mobile2,
		  home_tel:obj.home_tel,
		  fax:obj.fax,
		  web_link:obj.web_link,
		  web_link2:obj.web_link2,
		  web_link3:obj.web_link3,
		  web_link4:obj.web_link4,
		  web_link5:obj.web_link5,
		  web_link6:obj.web_link6,
		  address:obj.address,
		  address2:obj.address2,
		  division :obj.division,
		  department:obj.department,
		  country:obj.country,
		  bio:obj.bio,
		  company_website_url:obj.company_website_url,
		  more_info_tab_url:obj.more_info_tab_url,
		  facebook_url:obj.facebook_url,
		  instagram_url:obj.instagram_url,
		  whatsapp_url:obj.whatsapp_url,
		  linkedin_url:obj.linkedin_url,
		  youtube_url:obj.youtube_url,
		  twitter_url:obj.twitter_url,
		  wechat_id:obj.wechat_id,
		  smartcard_uid:obj.smartcard_uid,
		  bizcard_option: obj.bizcard_option,
		  status:obj.status,
         
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Staffs");

    worksheet.columns = [
      { header: "name", key: "fname", width: 25 },
      { header: "company_name", key: "company_name", width: 25 },
      { header: "work_email", key: "work_email", width: 25 },
      { header: "home_email", key: "home_email", width: 25 },
	  { header: "other_email", key: "other_email", width: 25 },
	  { header: "position", key: "position", width: 25 },
	  { header: "work_tel", key: "work_tel", width: 25 },
	  { header: "work_tel2", key: "work_tel2", width: 25 },
	  { header: "mobile", key: "mobile", width: 25 },
	  { header: "mobile2", key: "mobile2", width: 25 },
	  { header: "home_tel", key: "home_tel", width: 25 },
	  { header: "fax", key: "fax", width: 25 },
	  { header: "web_link", key: "web_link", width: 25 },
	  { header: "web_link2", key: "web_link2", width: 25 },
	  { header: "web_link3", key: "web_link3", width: 25 },
	  { header: "web_link4", key: "web_link4", width: 25 },
	  { header: "web_link5", key: "web_link5", width: 25 },
	  { header: "web_link6", key: "web_link6", width: 25 },
	  { header: "address", key: "address", width: 25 },
	  { header: "address2", key: "address2", width: 25 },
	  { header: "division", key: "division", width: 25 },
	  { header: "department", key: "department", width: 25 },
	  { header: "country", key: "country", width: 25 },
	  { header: "bio", key: "bio", width: 25 },
	  { header: "company_website_url", key: "company_website_url", width: 25 },
	  { header: "more_info_tab_url", key: "more_info_tab_url", width: 25 },
	  { header: "facebook_url", key: "facebook_url", width: 25 },
	  { header: "instagram_url", key: "instagram_url", width: 25 },
	  { header: "whatsapp_url", key: "whatsapp_url", width: 25 },
	  { header: "linkedin_url", key: "linkedin_url", width: 25 },
	  { header: "youtube_url", key: "youtube_url", width: 25 },
	  { header: "twitter_url", key: "twitter_url", width: 25 },
	  { header: "wechat_id", key: "wechat_id", width: 25 },
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
