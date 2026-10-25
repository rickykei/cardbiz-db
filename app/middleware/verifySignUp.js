const db = require("../models");
const Role = db.roles;
const User = db.users;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

checkRolesExisted0 = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
	  Role.findOne({
				name: req.body.roles[i]
	  }).exec((err,role)=>{
       if(err){
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
		  });
		  return;
	   }
    });
	next();
  }
  }
		 
};


// 校验请求中的 roles 是否都真实存在；只有全部存在才放行
checkRolesExisted = (req, res, next) => {
  if (!req.body.roles || req.body.roles.length === 0) {
    return next();
  }

  Role.find({ name: { $in: req.body.roles } }).exec((err, roles) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    const found = roles.map((r) => r.name);
    const missing = req.body.roles.filter((name) => !found.includes(name));

    if (missing.length > 0) {
      return res.status(400).send({
        message: `Failed! Role ${missing.join(", ")} does not exist!`
      });
    }

    next();
  });
};


const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
