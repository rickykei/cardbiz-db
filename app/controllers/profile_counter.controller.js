 
const db = require("../models");
const Profile_counter = db.profile_counter;
const Staff = db.staffs;

//var ObjectId = require('mongodb').ObjectId; 
const { ObjectId } = require('mongoose').Types;
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

exports.downloadStaffLogExcel = async (req, res) => {
  console.log("🚀 导出开始");
  const { company_id, uid } = req.query;
  let nfc = 0;
  let query = {};

  if (!company_id || !uid) return res.status(400).send("ERROR");

  if (company_id !== "63142fd5b54bdbb18f556016") {
    query.company_id = ObjectId(company_id);
    query.createdAt = { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };
    console.log("📊 非NFC公司：90天");
  } else {
    nfc = 1;
    query.createdAt = { $gte: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) };
    console.log("📊 NFC公司：20天");
  }

  try {
    // ============================
    // 【最关键优化】只遍历 ONCE
    // ============================
    const cursor = Profile_counter.find(query)
      .select("staff_id updatedAt ip user_agent")
      .lean()
      .cursor();

    // 准备 Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=staffProfile.xlsx");

    const workbook = new excel.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false,
      useSharedStrings: false
    });
    const worksheet = workbook.addWorksheet("staff");

    // 列
    if (nfc === 0) {
      worksheet.columns = [
        { header: "updatedAtDate", key: "updatedAtDate", width: 20 },
        { header: "updatedAtTime", key: "updatedAtTime", width: 20 },
        { header: "company_name_eng", key: "company_name_eng", width: 25 },
        { header: "company_name_chi", key: "company_name_chi", width: 25 },
        { header: "first_name", key: "fname", width: 15 },
        { header: "last_name", key: "lname", width: 15 },
        { header: "position", key: "position", width: 20 },
        { header: "address", key: "address", width: 30 },
        { header: "staff_no", key: "staff_no", width: 15 },
        { header: "division", key: "division", width: 18 },
        { header: "department", key: "department", width: 18 },
        { header: "country", key: "country", width: 15 },
      ];
    } else {
      worksheet.columns = [
        { header: "updatedAtDate", key: "updatedAtDate", width: 20 },
        { header: "updatedAtTime", key: "updatedAtTime", width: 20 },
        { header: "company_name_eng", key: "company_name_eng", width: 25 },
        { header: "company_name_chi", key: "company_name_chi", width: 25 },
        { header: "first_name", key: "fname", width: 15 },
        { header: "last_name", key: "lname", width: 15 },
        { header: "position", key: "position", width: 20 },
        { header: "address", key: "address", width: 30 },
        { header: "staff_no", key: "staff_no", width: 15 },
        { header: "division", key: "division", width: 18 },
        { header: "department", key: "department", width: 18 },
        { header: "country", key: "country", width: 15 },
        { header: "ip", key: "ip", width: 15 },
        { header: "user_agent", key: "user_agent", width: 40 },
      ];
    }

    // ============================
    // 流式逐行处理（内存永远低）
    // ============================
    for await (const obj of cursor) {
      try {
        // 1. 跳过空 staff_id
        if (!obj.staff_id) continue;

        // 2. 过滤非法 ObjectId（防崩溃）
        const staffId = obj.staff_id.toString();
        if (!ObjectId.isValid(staffId)) continue;

        // 3. 【核心】实时查是否存在（不加载百万数据）
        const staff = await Staff.findById(staffId).lean();
        if (!staff) continue;

        // 4. 写入行
        const dt = new Date(obj.updatedAt);
        const row = {
          updatedAtDate: dt.toISOString().split('T')[0],
          updatedAtTime: dt.toTimeString().slice(0, 8),
          company_name_eng: staff.company_name_eng || "",
          company_name_chi: staff.company_name_chi || "",
          fname: staff.fname || "",
          lname: staff.lname || "",
          position: staff.position || "",
          address: staff.address || "",
          staff_no: staff.staff_no || "",
          division: staff.division || "",
          department: staff.department || "",
          country: staff.country || "",
        };

        if (nfc) {
          row.ip = obj.ip || "";
          row.user_agent = obj.user_agent || "";
        }

        worksheet.addRow(row).commit();

      } catch (e) {
        continue;
      }
    }

    await workbook.commit();
    console.log("✅ 导出完成！");

  } catch (err) {
    console.error("❌ 错误:", err.message);
    if (!res.headersSent) res.status(500).send("FAIL");
  }
};

exports.downloadStaffLogExcel3 = (req, res) => {
  console.log("entered Profile_counter.downloadStaffLogExcel");
  const populate = ['staff_id'];
  let query = {};
  let nfc = 0;
  const { company_id, uid } = req.query;

  // 参数校验
  if (!company_id || !uid) {
    return res.status(400).send("ERROR");
  }

  // 构建查询条件
  if (company_id !== "63142fd5b54bdbb18f556016") {
    query.company_id = ObjectId(company_id);
    query.createdAt = { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) };
    console.log("non nfc last 90 days record");
  } else {
    nfc = 1;
    query.createdAt = { $gte: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) };
    console.log("nfc only 10 days record");
  }

  // ==============================================
  // 关键：设置响应头（必须在流式写入前设置）
  // ==============================================
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=staffProfile.xlsx");

  // ==============================================
  // 关键：创建流式Excel工作簿
  // ==============================================
  const workbook = new excel.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: false,
    useSharedStrings: false,
  });
  const worksheet = workbook.addWorksheet("staffprofilelog");

  // 设置列
  if (nfc === 0) {
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
      { header: "division", key: "division", width: 25 },
      { header: "department", key: "department", width: 25 },
      { header: "country", key: "country", width: 25 },
    ];
  } else {
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
      { header: "division", key: "division", width: 25 },
      { header: "department", key: "department", width: 25 },
      { header: "country", key: "country", width: 25 },
      { header: "ip", key: "ip", width: 25 },
      { header: "user_agent", key: "user_agent", width: 35 },
    ];
  }

  // ==============================================
  // 【核心】Mongoose 游标流式查询（不加载全部数据到内存）
  // ==============================================
  const cursor = Profile_counter.find(query)
    .populate(populate)
    .lean() // 纯JSON，提升性能
    .cursor(); // 使用游标

  // 逐行处理数据 + 逐行写入Excel
  cursor.on('data', (obj) => {
    try {
      if (!obj.staff_id) return;

      // 日期格式化
      const updatedAt = new Date(obj.updatedAt);
      const updatedAtDate = updatedAt.toISOString().split('T')[0];
      const updatedAtTime = updatedAt.toTimeString().split(' ')[0];

      // 构造行数据
      const row = {
        updatedAtDate,
        updatedAtTime,
        company_name_eng: obj.staff_id.company_name_eng || "",
        company_name_chi: obj.staff_id.company_name_chi || "",
        fname: obj.staff_id.fname || "",
        lname: obj.staff_id.lname || "",
        position: obj.staff_id.position || "",
        address: obj.staff_id.address || "",
        address2: obj.staff_id.address2 || "",
        address3: obj.staff_id.address3 || "",
        address4: obj.staff_id.address4 || "",
        staff_no: obj.staff_id.staff_no || "",
        division: obj.staff_id.division || "",
        department: obj.staff_id.department || "",
        country: obj.staff_id.country || "",
      };

      // NFC公司追加字段
      if (nfc === 1) {
        row.ip = obj.ip || "";
        row.user_agent = obj.user_agent || "";
      }

      // 逐行写入并立即释放内存
      worksheet.addRow(row).commit();
    } catch (e) {
      console.error("单条数据处理失败", e);
    }
  });

  // 查询结束 → 完成Excel
  cursor.on('end', async () => {
    await workbook.commit();
    console.log("✅ Excel流式导出完成，无内存溢出");
  });

  // 错误处理
  cursor.on('error', (err) => {
    console.error("❌ 导出失败：", err);
    if (!res.headersSent) res.status(500).send("导出失败");
  });
};


exports.downloadStaffLogExcel2 =  (req, res) => {
  console.log("entered Profile_counter.downloadStaffLogExcel");
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
  Profile_counter.find(query).populate(populate)
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
		let worksheet = workbook.addWorksheet("staffprofilelog");
	 	

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
		  "attachment; filename=" + "staffProfile.xlsx"
		);

		return workbook.xlsx.write(res).then(function () {
		  res.status(200).end();
		});
	
	
    });
	 
	 
};
