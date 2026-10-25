const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
 

  // 以下所有用户管理接口都需要登录态
  app.get("/api/users", [authJwt.verifyToken, authJwt.isModerator], controller.findAll);
  app.get("/api/users/active", [authJwt.verifyToken, authJwt.isModerator], controller.findAllActive);
  app.get("/api/users/:id", [authJwt.verifyToken, authJwt.isModerator], controller.findOne);
  app.put("/api/users/:id", [authJwt.verifyToken, authJwt.isModerator], controller.update);
  // 删除属于高危操作，仅管理员可执行
  app.delete("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
  app.delete("/api/users/", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteAll);
  
};
