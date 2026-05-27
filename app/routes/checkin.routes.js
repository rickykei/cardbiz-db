const express = require('express');
const router = express.Router();
const Checkin = require('../model/Checkin');
const Checkout = require('../model/Checkout');

router.post('/in', async (req, res) => {
  try {
    const { staffCode } = req.body;
    if (!staffCode) return res.status(400).json({ message: 'staffCode is required' });

    const record = await Checkin.create({
      staffId: staffCode,
      company_id: req.company_id,
      scanDate: new Date()
    });

    res.json({ success: true, staffCode, scanDate: record.scanDate });
  } catch (error) {
    res.status(500).json({ message: 'Check In failed' });
  }
});

router.post('/out', async (req, res) => {
  try {
    const { staffCode } = req.body;
    if (!staffCode) return res.status(400).json({ message: 'staffCode is required' });

    const record = await Checkout.create({
      staffId: staffCode,
      company_id: req.company_id,
      scanDate: new Date()
    });

    res.json({ success: true, staffCode, scanDate: record.scanDate });
  } catch (error) {
    res.status(500).json({ message: 'Check Out failed' });
  }
});

router.get('/records', async (req, res) => {
  try {
    const checkins = await Checkin.find({ company_id: req.company_id }).sort({ scanDate: -1 });
    const checkouts = await Checkout.find({ company_id: req.company_id }).sort({ scanDate: -1 });
    res.json({ checkins, checkouts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching records' });
  }
});

module.exports = router;