module.exports = app => {
  const vcf_counter = require("../controllers/vcf_counter.controller.js");
 const { authJwt } = require("../middleware");
  var router = require("express").Router();
   // 该路由下所有接口均需登录态
  router.use(authJwt.verifyToken);
  router.get("/getVcfCountByStaffId", vcf_counter.getVcfCountByStaffId);
  router.get("/getVcfCountMonthlyByStaffId", vcf_counter.getVcfCountMonthlyByStaffId);
  router.get("/", vcf_counter.findAll);
  router.get("/downloadStaffLogExcel", vcf_counter.downloadStaffLogExcel);
   
  
  app.use("/api/vcf_counter", router);
};
