const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // 注册：必须由已登录的管理员执行，禁止匿名自助注册（并禁止匿名指定 roles 提权）
  app.post(
    "/api/auth/signup",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  // 登录：保持公开（口令校验 + 邮件 6 位码二次校验）
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signinWithToken", authJwt.verifyToken,controller.signinWithToken);

  // 改密：必须已登录；仅本人可改（需校验旧口令），管理员可为他人重置
  app.post(
    "/api/auth/changePassword",
    authJwt.verifyToken,
    controller.changePassword
  );
};
