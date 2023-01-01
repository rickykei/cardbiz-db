module.exports = app => {
  const staff_logs = require("../controllers/staff_log.controller.js");

  var router = require("express").Router();

 
  // Retrieve all Tutorials
  router.get("/", staff_logs.findAll);
  router.get("/downloadStaffLogExcel", staff_logs.downloadStaffLogExcel);
  
  app.use("/api/staff_logs", router);
};
