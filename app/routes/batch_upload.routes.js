module.exports = app => {
  const router = require("express").Router();
  const upload = require("../middleware/uploadexcel");
  const batch_upload = require("../controllers/batch_upload.controller");
  const { authJwt } = require("../middleware");


  // 该路由下所有接口均需登录态
  router.use(authJwt.verifyToken);

  // 该路由下所有接口均需登录态（批量写入属于高危操作，仅管理员）
  router.post(
    "/uploadStaffExcelAddOnly",
    authJwt.isModerator,
    upload.single("file"),
    batch_upload.uploadStaffExcelAddOnly
  );
  router.post(
    "/uploadStaffExcel",
    authJwt.isModerator,
    upload.single("file"),
    batch_upload.uploadStaffExcel
  );
  router.get("/downloadStaffExcel", authJwt.isModerator, batch_upload.downloadStaffExcel);

  app.use("/api/batch_upload", router);
};
