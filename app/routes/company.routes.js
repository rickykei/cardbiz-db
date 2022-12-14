module.exports = app => {
  const companies = require("../controllers/company.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", companies.create);

  // Retrieve all Tutorials
  router.get("/", companies.findAll);

  // Retrieve all published Tutorials
  router.get("/active", companies.findAllActive);

  router.get("/codelist", companies.findCodeList);
  
  // Retrieve a single Tutorial with id
  router.get("/:id", companies.findOne);

  // Update a Tutorial with id
  router.put("/:id", companies.update);
  
  // update company by hr admin
  router.post("/:id", companies.updateByHRAdmin);


  // Delete a Tutorial with id
  router.delete("/:id", companies.delete);

  // Create a new Tutorial
  router.delete("/", companies.deleteAll);

  app.use("/api/companies", router);
};
