module.exports = app => {
  const vcf_counter = require("../controllers/vcf_counter.controller.js");

  var router = require("express").Router();
 
  router.get("/getVcfCountByStaffId", vcf_counter.getVcfCountByStaffId);
  router.get("/getVcfCountMonthlyByStaffId", vcf_counter.getVcfCountMonthlyByStaffId);
  router.get("/", vcf_counter.findAll);
  app.use("/api/vcf_counter", router);
};
