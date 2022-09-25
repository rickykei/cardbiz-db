module.exports = app => {
  const vcf_counter = require("../controllers/vcf_counter.controller.js");

  var router = require("express").Router();
 
  router.get("/getVcfCount", vcf_counter.getVcfCount);
 
  app.use("/api/vcf_counter", router);
};
