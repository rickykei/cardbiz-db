module.exports = app => {
  const locations = require("../controllers/location.controller.js");

  var router = require("express").Router();

  router.get("/", locations.findAll);
  router.post("/add", locations.create);
  router.put("/update/:id", locations.update);
  router.delete("/delete/:id", locations.delete);

  app.use("/api/location", router);
};