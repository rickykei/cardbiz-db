const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
	company_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
      }
    ,
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    status: Boolean
  },
  { timestamps: true })
);

module.exports = User;
