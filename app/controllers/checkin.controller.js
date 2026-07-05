
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const excel = require('exceljs');
const Attendance = require('../models/attendance.model');
const Staff = require('../models/staff.model');

// 簽到
// 簽到
exports.checkIn = async (req, res) => {
  try {
    const { staffId, companyId, scanDate, location, locationId } = req.body;

    const record = new Attendance({
      staff_id: staffId,
      company_id: companyId,
      type: 'in',
      location: location || '未指定',
      location_id: locationId,
      scanDate: scanDate
    });
    await record.save();

    // 用 populate 直接從 Attendance 關聯查出員工
    const result = await Attendance.findById(record._id).populate('staff_id', 'fname lname');

    res.json({
      status: 'ok',
      fname: result?.staff_id?.fname || '',
      lname: result?.staff_id?.lname || ''
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 簽退
exports.checkOut = async (req, res) => {
  try {
    const { staffId, companyId, scanDate, location, locationId } = req.body;

    const record = new Attendance({
      staff_id: staffId,
      company_id: companyId,
      type: 'out',
      location: location || '未指定',
      location_id: locationId,
      scanDate: scanDate
    });
    await record.save();

    // 同樣用 populate
    const result = await Attendance.findById(record._id).populate('staff_id', 'fname lname');

    res.json({
      status: 'ok',
      fname: result?.staff_id?.fname || '',
      lname: result?.staff_id?.lname || ''
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 列表
exports.getRecords = async (req, res) => {
  try {
    const { companyId, type } = req.body;

    let query = {
      company_id: companyId
    };

    if (type === 'in' || type === 'out') {
      query.type = type;
    }

    const records = await Attendance.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('staff_id', 'fname lname')
      .populate('location_id', 'name') // 👈 直接关联取最新名称
      .lean();

    // 自动显示最新地名，旧数据兼容
    const result = records.map(r => ({
      ...r,
      // 有 location_id 就用最新名称，否则用旧的字符串
      currentLocation: r.location_id?.name || r.location
    }));

    res.json(result);
  } catch (err) {
    res.status(500).send('FAIL');
  }
};

// 匯出 only in
exports.download_checkin = async (req, res) => {
  console.log("🚀 download_checkin");
  const { company_id, uid } = req.query;
  if (!company_id || !uid) return res.status(400).send("ERROR");

  try {
    const records = await Attendance.find({
      company_id: ObjectId(company_id),
      type: 'in',
      
      createdAt: { $gte: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) }
    })
      .sort({ createdAt: -1 })
      .populate({ path: 'staff_id', select: 'fname lname' })
      .lean();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=staffCheckin.xlsx");

    const workbook = new excel.stream.xlsx.WorkbookWriter({ stream: res });
    const ws = workbook.addWorksheet("Checkin");
    ws.columns = [
      { header: "checkInDate", key: "checkInDate", width: 20 },
      { header: "checkInTime", key: "checkInTime", width: 20 },
      { header: "first_name", key: "fname", width: 15 },
      { header: "last_name", key: "lname", width: 15 }
    ];

    for (const rec of records) {
      try {
        const staff = rec.staff_id;
        if (!staff) continue;
        const dt = new Date(rec.createdAt);
        const checkInDate = dt.toISOString().split('T')[0];
        const checkInTime = dt.toTimeString().slice(0, 8);
        ws.addRow({ checkInDate, checkInTime, fname: staff.fname, lname: staff.lname }).commit();
      } catch (e) { continue }
    }

    await workbook.commit();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).send("FAIL");
  }
};

// 匯出 only out
exports.download_checkout = async (req, res) => {
  console.log("🚀 download_checkout");
  const { company_id, uid } = req.query;
  if (!company_id || !uid) return res.status(400).send("ERROR");

  try {
    const records = await Attendance.find({
      company_id: ObjectId(company_id),
      type: 'out',
      createdAt: { $gte: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) }
    })
      .sort({ createdAt: -1 })
      .populate({ path: 'staff_id', select: 'fname lname' })
      .lean();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=staffCheckout.xlsx");

    const workbook = new excel.stream.xlsx.WorkbookWriter({ stream: res });
    const ws = workbook.addWorksheet("Checkout");
    ws.columns = [
      { header: "checkOutDate", key: "checkOutDate", width: 20 },
      { header: "checkOutTime", key: "checkOutTime", width: 20 },
      { header: "first_name", key: "fname", width: 15 },
      { header: "last_name", key: "lname", width: 15 }
    ];

    for (const rec of records) {
      try {
        const staff = rec.staff_id;
        if (!staff) continue;
        const dt = new Date(rec.createdAt);
        const checkOutDate = dt.toISOString().split('T')[0];
        const checkOutTime = dt.toTimeString().slice(0, 8);
        ws.addRow({ checkOutDate, checkOutTime, fname: staff.fname, lname: staff.lname }).commit();
      } catch (e) { continue }
    }

    await workbook.commit();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).send("FAIL");
  }
};

// 上下班匯總 Excel
exports.download_summary = async (req, res) => {
  console.log("🚀 download_summary");

  const { company_id, uid } = req.query;
  if (!company_id || !uid) return res.status(400).send("ERROR");

  try {
    // 一次查詢所有記錄（近 100 天）
    const records = await Attendance.find({
      company_id: ObjectId(company_id),
      createdAt: { $gte: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) }
    })
      .sort({ createdAt: 1 })
      .populate({ path: 'staff_id', select: 'fname lname' })
      .lean();

    // 按「員工 + 日期」分組
    const summaryMap = {};

    for (const rec of records) {
      try {
        const staff = rec.staff_id;
        if (!staff) continue;

        const staffKey = staff._id.toString();
        const dateStr = new Date(rec.createdAt).toISOString().split('T')[0];
        const key = `${staffKey}_${dateStr}`;

        if (!summaryMap[key]) {
          summaryMap[key] = {
            staffId: staffKey,
            fname: staff.fname || '',
            lname: staff.lname || '',
            date: dateStr,
            checkInTime: null,
            checkOutTime: null
          };
        }

        const timeStr = new Date(rec.createdAt).toTimeString().slice(0, 8);

        if (rec.type === 'in') {
          // 取最早的 checkin
          if (!summaryMap[key].checkInTime || timeStr < summaryMap[key].checkInTime) {
            summaryMap[key].checkInTime = timeStr;
          }
        } else if (rec.type === 'out') {
          // 取最晚的 checkout
          if (!summaryMap[key].checkOutTime || timeStr > summaryMap[key].checkOutTime) {
            summaryMap[key].checkOutTime = timeStr;
          }
        }
      } catch (e) {
        continue;
      }
    }

    // 轉成陣列並按日期排序
    const summaryList = Object.values(summaryMap)
      .sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return a.lname.localeCompare(b.lname);
      });

    // 計算工時
    const calcDuration = (inTime, outTime) => {
      if (!inTime || !outTime) return '';
      const [h1, m1, s1] = inTime.split(':').map(Number);
      const [h2, m2, s2] = outTime.split(':').map(Number);
      const diff = (h2 * 3600 + m2 * 60 + s2) - (h1 * 3600 + m1 * 60 + s1);
      if (diff <= 0) return '';
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      return `${h}小時${m}分鐘`;
    };

    // 寫入 Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=attendance_summary.xlsx");

    const workbook = new excel.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false,
      useSharedStrings: false
    });

    const worksheet = workbook.addWorksheet("AttendanceSummary");

    worksheet.columns = [
      { header: "日期", key: "date", width: 15 },
      { header: "姓氏", key: "lname", width: 15 },
      { header: "名字", key: "fname", width: 15 },
      { header: "上班時間", key: "checkInTime", width: 15 },
      { header: "下班時間", key: "checkOutTime", width: 15 },
      { header: "工時", key: "duration", width: 15 }
    ];

    for (const row of summaryList) {
      worksheet.addRow({
        date: row.date,
        lname: row.lname,
        fname: row.fname,
        checkInTime: row.checkInTime || '-',
        checkOutTime: row.checkOutTime || '-',
        duration: calcDuration(row.checkInTime, row.checkOutTime)
      }).commit();
    }

    await workbook.commit();
    console.log("✅ 匯總匯出完成，共", summaryList.length, "筆");

  } catch (err) {
    console.error("❌ download_summary error:", err);
    if (!res.headersSent) res.status(500).send("FAIL");
  }
};

// 全部打卡記錄 Excel（同一 Sheet，用 type 區分 in/out）
exports.download_all = async (req, res) => {
  console.log("🚀 download_all");

  const { company_id, uid } = req.query;
  if (!company_id || !uid) return res.status(400).send("ERROR");

  try {
    const records = await Attendance.find({
      company_id: ObjectId(company_id),
      createdAt: { $gte: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) }
    })
      .sort({ createdAt: -1 })
      .populate({ path: 'staff_id', select: 'fname lname' })
      .lean();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=staff_attendance_all.xlsx");

    const workbook = new excel.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false,
      useSharedStrings: false
    });

    const worksheet = workbook.addWorksheet("Attendance");

    worksheet.columns = [
      { header: "日期", key: "date", width: 15 },
      { header: "時間", key: "time", width: 15 },
      { header: "類型", key: "type", width: 12 },
      { header: "姓氏", key: "lname", width: 15 },
      { header: "名字", key: "fname", width: 15 }
    ];

    for (const rec of records) {
      try {
        const staff = rec.staff_id;
        if (!staff) continue;

        const dt = new Date(rec.createdAt);
        const date = dt.toISOString().split('T')[0];
        const time = dt.toTimeString().slice(0, 8);

        worksheet.addRow({
          date,
          time,
          type: rec.type === 'in' ? 'Check-in' : 'Check-out',
          fname: staff.fname || "",
          lname: staff.lname || ""
        }).commit();
      } catch (e) { continue }
    }

    await workbook.commit();
    console.log("✅ 全部記錄匯出完成");

  } catch (err) {
    console.error("❌ download_all error:", err);
    if (!res.headersSent) res.status(500).send("FAIL");
  }
};