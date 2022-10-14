module.exports =  app =>  {
	const router = require("express").Router();
    const upload = require("../middleware/uploadexcel");
    const batch_upload = require("../controllers/batch_upload.controller");
    router.post("/uploadStaffExcelAddOnly", upload.single("file"),batch_upload.uploadStaffExcelAddOnly);
    router.post("/uploadStaffExcel", upload.single("file"),batch_upload.uploadStaffExcel);
    router.get("/downloadStaffExcel",batch_upload.downloadStaffExcel);
  
  app.use("/api/batch_upload", router);
};
