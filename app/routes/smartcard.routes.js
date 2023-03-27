const { authJwt } = require("../middlewares");
const controller = require("../controllers/smartcard.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  
  app.post("/api/smartcards/", controller.create);
  app.get("/api/smartcards", controller.findAll);
  app.get("/api/smartcards/active", controller.findAllActive);
  app.get("/api/smartcards/findByCompanyId", controller.findByCompanyId);
  app.get("/api/smartcards/findByCompanyIdPullDown", controller.findByCompanyIdPullDown);
  app.get("/api/smartcards/:id", controller.findOne);
  app.put("/api/smartcards/:id", controller.update);
  app.delete("/api/smartcards/:id", controller.delete);
  app.delete("/api/smartcards/", controller.deleteAll);
  
};
