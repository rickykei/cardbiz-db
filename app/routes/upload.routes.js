module.exports = app => {
  const uploads = require("../controllers/upload.controller.js");

  var router = require("express").Router();
 
  // Retrieve all image
  router.get("/:name", uploads.download);
 
  app.use("/api/files", router);
};
