module.exports = app => {
  const mobilesite_counter = require("../controllers/mobilesite_counter.controller");
  var router = require("express").Router();
  router.get("/downloadStaffMobileSiteExcel", mobilesite_counter.downloadStaffMobileSiteExcel);
  app.use("/api/mobilesite_counter", router);
};
