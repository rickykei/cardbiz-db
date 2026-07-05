module.exports = app => {
  
  const checkins = require("../controllers/checkin.controller.js");

  var router = require("express").Router();

  router.post('/in', checkins.checkIn);
  router.post('/out', checkins.checkOut);
  router.post('/records', checkins.getRecords);
  router.get('/download_checkin', checkins.download_checkin);
  router.get('/download_checkout', checkins.download_checkout);
  router.get('/download_summary', checkins.download_summary);
 router.get('/download_all', checkins.download_all);

  app.use("/api/checkin", router);
};
