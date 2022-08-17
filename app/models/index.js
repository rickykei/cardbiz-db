const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js")(mongoose, mongoosePaginate);
db.companies = require("./company.model.js")(mongoose, mongoosePaginate);
db.staffs = require("./staff.model.js")(mongoose, mongoosePaginate);
db.users = require("./user.model")(mongoose, mongoosePaginate);
db.roles = require("./role.model")(mongoose, mongoosePaginate);
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
