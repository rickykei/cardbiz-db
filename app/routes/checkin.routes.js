module.exports = app => {
  
  const checkins = require("../controllers/checkin.controller.js");

  var router = require("express").Router();

  router.post('/in', checkins.checkIn);
  router.post('/out', checkins.checkOut);
  router.post('/records', checkins.getRecords);
  router.get('/download_checkin', checkins.download_checkin);
  router.get('/download_checkout', checkins.download_checkout);

  app.use("/api/checkin", router);
};
