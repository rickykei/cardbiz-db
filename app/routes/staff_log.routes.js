module.exports = app => {
  const staff_logs = require("../controllers/staff_log.controller.js");

  var router = require("express").Router();

 
  // Retrieve all Tutorials
  router.get("/", staff_logs.findAll);
  
  
  app.use("/api/staff_logs", router);
};
