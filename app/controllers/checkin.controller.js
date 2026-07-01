
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const excel = require('exceljs');
const Attendance = require('../models/attendance.model');
const Staff = require('../models/staff.model');

// 簽到
exports.checkIn = async (req, res) => {
  try {
    const { staffId, companyId, scanDate } = req.body;
    const record = new Attendance({
      staff_id: staffId,
      company_id: companyId,
      type: 'in',
      scanDate: scanDate
    });
    await record.save();
    res.json({ status: 'ok', fname: '', lname: '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 簽退
exports.checkOut = async (req, res) => {
  try {
    const { staffId, companyId, scanDate } = req.body;
    const record = new Attendance({
      staff_id: staffId,
      company_id: companyId,
      type: 'out',
      scanDate: scanDate
    });
    await record.save();
    res.json({ status: 'ok', fname: '', lname: '' });
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

    // 有傳 type 就只對應類型（in / out），沒傳就全部返回
    if (type === 'in' || type === 'out') {
      query.type = type;
    }

    const records = await Attendance.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('staff_id', 'fname lname')
      .lean();

    res.json(records);
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