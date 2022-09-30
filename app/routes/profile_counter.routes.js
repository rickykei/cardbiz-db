module.exports = app => {
  const profile_counter = require("../controllers/profile_counter.controller");

   var router = require("express").Router();
  
  router.get("/getProfileCountByStaffId", profile_counter.getProfileCountByStaffId);
  router.get("/", profile_counter.findAll);
  router.post("/",profile_counter.create);
  app.use("/api/profile_counter", router);
};
