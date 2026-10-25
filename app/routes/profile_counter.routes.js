module.exports = app => {
  const profile_counter = require("../controllers/profile_counter.controller");
 const { authJwt } = require("../middleware");
   var router = require("express").Router();
    // 该路由下所有接口均需登录态
  router.use(authJwt.verifyToken);

  router.get("/getProfileCountByStaffId", profile_counter.getProfileCountByStaffId);
  router.get("/getProfileCountMonthlyByStaffId", profile_counter.getProfileCountMonthlyByStaffId);
  router.get("/", profile_counter.findAll);
  router.post("/",profile_counter.create);
  router.get("/downloadStaffLogExcel", profile_counter.downloadStaffLogExcel);
  
  
  app.use("/api/profile_counter", router);
};
