const db = require("../models");
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
 const readXlsxFile = require('read-excel-file/node')
const excel = require("exceljs")
const Staff = db.staffs;
const Checkin = db.checkin;
const Checkout = db.checkout;
 
exports.checkIn = async (req, res) => {
  try {
    const { staffId, companyId } = req.body;

    if (!staffId) return res.status(400).json({ message: 'staffId is required' });
    if (!companyId) return res.status(400).json({ message: 'companyId is required' });

    const staff = await Staff.findOne({
      _id: staffId,
      company_id: companyId
    });

    if (!staff) {
      return res.status(403).json({ message: 'Staff not found or does not belong to this company' });
    }

    const record = await Checkin.create({
      staff_id: staffId,
      company_id: companyId
    });

    res.json({
      success: true,
      staffId: record.staff_id,
      fname: staff.fname,
      lname: staff.lname
    });
  } catch (error) {
    console.error('Check In failed:', error);
    res.status(500).json({ message: 'Check In failed' });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const { staffId, companyId } = req.body;

    if (!staffId) return res.status(400).json({ message: 'staffId is required' });
    if (!companyId) return res.status(400).json({ message: 'companyId is required' });

    const staff = await Staff.findOne({
      _id: staffId,
      company_id: companyId
    });

    if (!staff) {
      return res.status(403).json({ message: 'Staff not found or does not belong to this company' });
    }

    const record = await Checkout.create({
      staff_id: staffId,
      company_id: companyId
    });

    res.json({
      success: true,
      staffId: record.staff_id,
      fname: staff.fname,
      lname: staff.lname
    });
  } catch (error) {
    console.error('Check Out failed:', error);
    res.status(500).json({ message: 'Check Out failed' });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: 'companyId is required' });
    }

    // 🔥 正统 mongoose populate，直接带出 fname + lname
    const checkins = await Checkin.find({ company_id: companyId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'staff_id',
        select: 'fname lname'
      });

    const checkouts = await Checkout.find({ company_id: companyId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'staff_id',
        select: 'fname lname'
      });

    res.json({
      success: true,
      checkins,
      checkouts
    });

  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ message: 'Error fetching records' });
  }
};
exports.download_checkin = async (req, res) => {
  console.log("🚀 进入 Checkin.download_checkin 导出");

  const { company_id, uid } = req.query;

  if (!company_id || !uid) return res.status(400).send("ERROR");

  try {
    // 🔥 一次查询：checkin + 关联 staff，只取需要的字段
    const checkins = await Checkin.find({
      company_id: ObjectId(company_id),
      createdAt: { $gte: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) }
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'staff_id',
        select: 'fname lname'  // 只拿姓名，轻量
      })
      .lean();

    // Excel 流式导出
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=staffCheckin.xlsx");

    const workbook = new excel.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false,
      useSharedStrings: false
    });

    const worksheet = workbook.addWorksheet("staffCheckinLog");

    worksheet.columns = [
      { header: "checkInDate", key: "checkInDate", width: 20 },
      { header: "checkInTime", key: "checkInTime", width: 20 },
      { header: "first_name", key: "fname", width: 15 },
      { header: "last_name", key: "lname", width: 15 },
    ];

    // 直接遍历，不再查库
    for (const record of checkins) {
      try {
        const staff = record.staff_id;
        if (!staff) continue;

        const dt = new Date(record.createdAt);
        const checkInDate = dt.toISOString().split('T')[0];
        const checkInTime = dt.toTimeString().slice(0, 8);

        worksheet.addRow({
          checkInDate,
          checkInTime,
          fname: staff.fname || "",
          lname: staff.lname || ""
        }).commit();

      } catch (err) {
        continue;
      }
    }

    await workbook.commit();
    console.log("✅ Checkin 导出完成！");

  } catch (err) {
    console.error("❌ Checkin 导出错误:", err.message);
    if (!res.headersSent) res.status(500).send("FAIL");
  }
};
exports.download_checkout = async (req, res) => {
  console.log("🚀 进入 Checkout.download_checkout 导出");

  const { company_id, uid } = req.query;

  if (!company_id || !uid) return res.status(400).send("ERROR");

  try {
    // 一次查询 checkout + 关联 staff
    const checkouts = await Checkout.find({
      company_id: ObjectId(company_id),
      createdAt: { $gte: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) }
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'staff_id',
        select: 'fname lname'
      })
      .lean();

    // Excel 匯出標頭
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=staffCheckout.xlsx");

    const workbook = new excel.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false,
      useSharedStrings: false
    });

    const worksheet = workbook.addWorksheet("staffCheckoutLog");

    worksheet.columns = [
      { header: "checkOutDate", key: "checkOutDate", width: 20 },
      { header: "checkOutTime", key: "checkOutTime", width: 20 },
      { header: "first_name", key: "fname", width: 15 },
      { header: "last_name", key: "lname", width: 15 },
    ];

    // 直接匯出，不再重複查庫
    for (const record of checkouts) {
      try {
        const staff = record.staff_id;
        if (!staff) continue;

        const dt = new Date(record.createdAt);
        const checkOutDate = dt.toISOString().split('T')[0];
        const checkOutTime = dt.toTimeString().slice(0, 8);

        worksheet.addRow({
          checkOutDate,
          checkOutTime,
          fname: staff.fname || "",
          lname: staff.lname || ""
        }).commit();

      } catch (err) {
        continue;
      }
    }

    await workbook.commit();
    console.log("✅ Checkout 导出完成！");

  } catch (err) {
    console.error("❌ Checkout 导出错误:", err.message);
    if (!res.headersSent) res.status(500).send("FAIL");
  }
};