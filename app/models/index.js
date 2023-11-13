const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
 
db.companies = require("./company.model.js")(mongoose, mongoosePaginate);
db.staffs = require("./staff.model.js")(mongoose, mongoosePaginate);
db.users = require("./user.model")(mongoose, mongoosePaginate);
db.roles = require("./role.model")(mongoose, mongoosePaginate);
db.smartcards = require("./smartcard.model")(mongoose, mongoosePaginate);
db.vcf_counter = require("./vcf_counter.model")(mongoose, mongoosePaginate);
db.profile_counter = require("./profile_counter.model")(mongoose, mongoosePaginate);
db.action_log = require("./action_log.model")(mongoose, mongoosePaginate);
db.staff_log = require("./staff_log.model")(mongoose, mongoosePaginate);
db.two_factors = require("./two_factors.model.js")(mongoose, mongoosePaginate);

module.exports = db;
