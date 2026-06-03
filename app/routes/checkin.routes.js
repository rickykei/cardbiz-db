module.exports = app => {
  
  const checkins = require("../controllers/checkin.controller.js");

  var router = require("express").Router();

  router.post('/in', checkins.checkIn);
  router.post('/out', checkins.checkOut);
  router.get('/records', checkins.getRecords);

  app.use("/api/checkin", router);
};
