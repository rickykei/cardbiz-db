module.exports = app => {
  const action_logs = require("../controllers/action_log.controller.js");

  var router = require("express").Router();
 
  router.post("/setLog", action_logs.setLog);
  router.get("/", action_logs.findAll);
  router.get("/getByAdminId", action_logs.getByAdminId);
  router.get("/getByCompanyId", action_logs.getByCompanyId);
  router.get("/getByStaffId", action_logs.getByStaffId);
 
  app.use("/api/action_logs", router);
};
