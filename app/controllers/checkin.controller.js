const db = require("../models");
var ObjectId = require('mongodb').ObjectId;

const Checkin = db.checkin;
const Checkout = db.checkout;

exports.checkIn = async (req, res) => {
    try {
        
        if (!req.body.staffId) return res.status(400).json({ message: 'staffId is required' });

        const record = await Checkin.create({
            staff_id: req.body.staffId,
            company_id: req.body.companyId 
        });

        res.json({ success: true, staffId: record.staff_id});
    } catch (error) {
        res.status(500).json({ message: 'Check In failed' });
        console.error('Check In failed:', error);
    }
};


exports.checkOut = async (req, res) => {
   try {
        
        if (!req.body.staffId) return res.status(400).json({ message: 'staffId is required' });

        const record = await Checkout.create({
            staff_id: req.body.staffId,
            company_id: req.body.companyId 
        });

        res.json({ success: true, staffId: record.staff_id});
    } catch (error) {
        res.status(500).json({ message: 'Check Out failed' });
        console.error('Check Out failed:', error);
    }
};

exports.getRecords = async (req, res) => {

    try {
        const checkins = await Checkin.find({ company_id: req.company_id }).sort({ scanDate: -1 });
        const checkouts = await Checkout.find({ company_id: req.company_id }).sort({ scanDate: -1 });
        res.json({ checkins, checkouts });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching records' });
    }
};