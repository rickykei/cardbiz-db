module.exports = app => {
  const profile_counter = require("../controllers/profile_counter.controller.js");

  var router = require("express").Router();
 
  router.get("/getProfileCountByStaffId", profile_counter.getProfileCountByStaffId);
  router.get("/", profile_counter.findAll);
  app.use("/api/profile_counter", router);
};
