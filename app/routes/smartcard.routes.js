const { authJwt } = require("../middleware");
const controller = require("../controllers/smartcard.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  
 // 智能卡接口全部需要登录态
  app.post("/api/smartcards/", [authJwt.verifyToken], controller.create);
  app.get("/api/smartcards", [authJwt.verifyToken], controller.findAll);
  app.get("/api/smartcards/active", [authJwt.verifyToken], controller.findAllActive);
  app.get("/api/smartcards/findByCompanyId", [authJwt.verifyToken], controller.findByCompanyId);
  app.get("/api/smartcards/:id", [authJwt.verifyToken], controller.findOne);
  app.put("/api/smartcards/:id", [authJwt.verifyToken], controller.update);
  // 删除属于高危操作，仅管理员可执行
  app.delete("/api/smartcards/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
  app.delete("/api/smartcards/", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteAll);
};
