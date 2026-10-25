module.exports = app => {
  const uploads = require("../controllers/upload.controller");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();
 
  // 文件下载接口需要登录态
  router.get("/:name",  uploads.download);
 
  app.use("/api/files", router);
};
