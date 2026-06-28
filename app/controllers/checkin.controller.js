const db = require("../models");
const mongoose = require('mongoose');

const Checkin = db.checkin;
const Checkout = db.checkout;
// 重點：用 mongoose.model 來取，避免 model 載入順序問題
const Staff = mongoose.model('staff');

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