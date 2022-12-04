module.exports = app => {
  const staffs = require("../controllers/staff.controller.js");

  var router = require("express").Router();

 router.post("/sendNotification",staffs.sendNotificationByStaffDocId);
 
  // Create a new Staff
  router.post("/", staffs.create);

  // Retrieve all Tutorials
  router.get("/", staffs.findAll);
  
  router.get("/findByCompanyId", staffs.findByCompanyId);

  // Retrieve all published Tutorials
  router.get("/published", staffs.findAllPublished);

  // Retrieve a single Staff with id
  router.get("/:id", staffs.findOne);

  // Update a Staff with id
  router.put("/:id", staffs.update);
  
  // update staff with id with image file
  router.post("/:id", staffs.update);
 
 
 
  // Delete a Staff with id
  router.delete("/:id", staffs.delete);

  
  router.delete("/", staffs.deleteAll);

  app.use("/api/staffs", router);
};
