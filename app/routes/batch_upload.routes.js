module.exports =  app =>  {
	const router = require("express").Router();
    const upload = require("../middleware/uploadexcel");
    const batch_upload = require("../controllers/batch_upload.controller");
    router.post("/uploadStaffExcelAddOnly", upload.single("file"),batch_upload.uploadStaffExcelAddOnly);
    router.post("/uploadStaffExcel", upload.single("file"),batch_upload.uploadStaffExcel);
	router.post("/uploadStaffJson", batch_upload.uploadStaffJson);
	router.post("/staffJson", batch_upload.uploadStaffJson);
	router.get("/downloadStaffJson", batch_upload.downloadStaffJson);
    router.get("/downloadStaffExcel",batch_upload.downloadStaffExcel);
	router.get("/staffJson", batch_upload.downloadStaffJson);

	
  app.use("/api/batch_upload", router);
};
