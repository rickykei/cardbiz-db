module.exports = app => {
  const gw_counter = require("../controllers/gw_counter.controller");
  var router = require("express").Router();
  router.get("/downloadStaffGWExcel", gw_counter.downloadStaffGWExcel);
  app.use("/api/gw_counter", router);
};
