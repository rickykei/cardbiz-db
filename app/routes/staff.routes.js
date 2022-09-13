module.exports = app => {
  const staffs = require("../controllers/staff.controller.js");

  var router = require("express").Router();

  // Create a new Staff
  router.post("/", staffs.create);

  // Retrieve all Tutorials
  router.get("/", staffs.findAll);

  // Retrieve all published Tutorials
  router.get("/published", staffs.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", staffs.findOne);

  // Update a Tutorial with id
  router.put("/:id", staffs.update);
  
  // update staff with id with image file
  router.post("/:id", staffs.update);
 
  // Delete a Tutorial with id
  router.delete("/:id", staffs.delete);

  // Create a new Tutorial
  router.delete("/", staffs.deleteAll);

  app.use("/api/staffs", router);
};
