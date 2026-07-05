const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Location = require('../models/location.model');

// 取得公司所有位置
exports.findAll = async (req, res) => {
  try {
    const { company_id } = req.query;

    if (!company_id) {
      return res.status(400).send("ERROR");
    }

    const locations = await Location.find({
      company_id: ObjectId(company_id),
      status: "active"
    }).sort({ name: 1 }).lean();

    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).send("FAIL");
  }
};

// 新增位置
exports.create = async (req, res) => {
  try {
    const { name, company_id } = req.body;

    if (!name || !company_id) {
      return res.status(400).json({ status: "error", message: "缺少必要欄位" });
    }

    const exist = await Location.findOne({
      name,
      company_id: ObjectId(company_id)
    });

    if (exist) {
      return res.json({ status: "error", message: "位置名稱重複" });
    }

    const location = new Location({
      name,
      company_id: ObjectId(company_id),
      status: "active"
    });

    await location.save();
    res.json({ status: "success", data: location });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 修改位置
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: "error", message: "請輸入位置名稱" });
    }

    const location = await Location.findByIdAndUpdate(
      id,
      { name, updatedAt: Date.now() },
      { new: true }
    );

    if (!location) {
      return res.status(404).json({ status: "error", message: "找不到資料" });
    }

    res.json({ status: "success", data: location });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 刪除位置
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({ status: "error", message: "找不到資料" });
    }

    res.json({ status: "success" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};