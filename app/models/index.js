const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js")(mongoose);
db.companies = require("./company.model.js")(mongoose);
db.staffs = require("./staff.model.js")(mongoose);
db.users = require("./user.model");
db.roles = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
