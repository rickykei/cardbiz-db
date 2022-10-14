const config = require("../config/auth.config");
const db = require("../models");
const User = db.users;
const Role = db.roles;
 
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
	 
  const user = new User({
    company_id: req.body.company_id,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
	 
    status: req.body.status ? req.body.status : false
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate('roles')
	.populate('company_id')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
 
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
	  var role=0;
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
		if(user.roles[i].name==='admin')
			role=0;
		else
			role=1;
      }
      res.status(200).send({
        id: user._id,
		company_id:	user.company_id.id,
		logo:user.company_id.logo,
        username: user.username,
        email: user.email,
        roles: authorities,
		role: role,
        accessToken: token
      });
    });
};


exports.changePassword = (req, res) => {
	
  console.log("--change password");
  console.log(req.body.id);
   if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  
	 
   var user_id=req.body.id;
   var password={ password: bcrypt.hashSync(req.body.password, 8)};
 

   User.findByIdAndUpdate(user_id, password, { useFindAndModify: false , omitUndefined: true})
    .then(data => {
		res.send({ message: "user password was updated successfully." });
	})
	.catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving company with id=" + req.body.id +err});
    });
	
	
};
