module.exports = app => {
  const staffs = require("../controllers/staff.controller");
  const { authJwt } = require("../middleware");

  var router = require("express").Router();

  // 该路由下所有接口均需登录态
  router.use(authJwt.verifyToken);

  router.post("/sendNotification", staffs.sendNotificationByStaffDocId);

  // Create a new Staff
  router.post("/", staffs.create);

  // Retrieve all Tutorials
  router.get("/", staffs.findAll);

  router.get("/findByCompanyId", staffs.findByCompanyId);

  // Retrieve all published Tutorials
  router.get("/published", staffs.findAllPublished);

  // Retrieve a single Staff with id
  router.get("/:id", staffs.findOne);

  // Update a Staff with id
  router.put("/:id", staffs.update);

  // update staff with id with image file
  router.post("/:id", staffs.update);

  // Delete a Staff with id（高危：仅管理员）
  router.delete("/:id", authJwt.isModerator, staffs.delete);

  // 清空全部（高危：仅管理员）
  router.delete("/", authJwt.isAdmin, staffs.deleteAll);

  app.use("/api/staffs", router);
};
