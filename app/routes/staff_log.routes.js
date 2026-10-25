module.exports = app => {
  const staff_logs = require("../controllers/staff_log.controller");
  const { authJwt } = require("../middleware");

  var router = require("express").Router();

  // 该路由下所有接口均需登录态
  router.use(authJwt.verifyToken);

  // Retrieve all Tutorials
  router.get("/", staff_logs.findAll);
  router.get("/downloadStaffLogExcel", staff_logs.downloadStaffLogExcel);

  app.use("/api/staff_logs", router);
};
