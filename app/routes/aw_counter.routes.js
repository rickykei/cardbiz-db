module.exports = app => {
  const aw_counter = require("../controllers/aw_counter.controller");
  var router = require("express").Router();
  router.get("/downloadStaffAWExcel", aw_counter.downloadStaffAWExcel);
  app.use("/api/aw_counter", router);
};
