const config = require("../config/auth.config");
const db = require("../models");
const User = db.users;
const Role = db.roles;
const TwoFactor = db.two_factors;
const nodemailer = require('nodemailer');


var mailTransport = nodemailer.createTransport({

  host: "smtpout.secureserver.net",
  //service: 'gmail',
  debug: true,
  secure: true,
  secureConnection: true,
  port: 465,
  tls: { rejectUnauthorized: false },
  auth: {
    //user: "info@profiles.digital",
    //user: "admin@profiles.digital",
    user: "admin@e-profile.digital",
    pass: "Soso2023~",
    //pass: "sysarguzfkymqgax",


  },
  logger: true,
});

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

      //write gen random six digits token and send email uid
      var sixDig = Math.floor(100000 + Math.random() * 900000);
      console.log("--token--");
      console.log(sixDig);

      const twofacts = new TwoFactor({
        user_id: user.id,
        token: sixDig,
      })

      //save token to db
      twofacts.save((err, twofact) => {

        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });


      // send email to user

      mailTransport.sendMail(
        {
          from: '6-digit Authorization Code <admin@e-profile.digital>',

          //to : 'Namecard_Application@cncbinternational.com',
          //
          to: 'rickykei@gmail.com',
          subject: '6-digit Authorization Code',
          html: '<p>Login to Your Account </p><p>Please confirm your account by entering the authorization code:</p>' + sixDig + '<p> It may take a minute to receive your code. </p>',
        },
        function (err) {
          if (err) {
            console.log('Unable to send email: ' + err);
          }
        },
      );

      var authorities = [];
      var role = 0;
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        if (user.roles[i].name === 'admin')
          role = 0;
        else
          role = 1;
      }
      res.status(200).send({
        id: user._id,
        company_id: user.company_id.id,
        logo: user.company_id.logo,
        username: user.username,
        email: user.email,
        roles: authorities,
        role: role,
        accessToken: token
      });
    });
};

exports.signinWithToken = (req, res) => {

  console.log("signinwithtoekn");
  console.log(req.body);
  //verify token
  var myDate = new Date(Date.now() - 1 * 60 * 5 * 1000);
  console.log(myDate);
  TwoFactor.findOne({
    user_id: req.userId,
    token: req.body.token,
    createdAt: { $gte: myDate }
  }, function (err, tf) {

    if (!tf) {
      return res.status(401).send({ message: "token Not found." });
    }

    console.log("response user");
    console.log(req.userId);
    //get user info	
    User.findOne({
      _id: req.userId
    })
      .populate('roles')
      .populate('company_id')
      .exec((err, user) => {

        console.log(user);
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!user) {
          return res.status(401).send({ message: "User Not found." });
        }


        //add JwtToken
        //var token = jwt.sign({ id: user.id }, config.secret, {
          //expiresIn: 86400 // 24 hours
        //});




        var authorities = [];
        var role = 0;
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
          if (user.roles[i].name === 'admin')
            role = 0;
          else
            role = 1;
        }
        res.status(200).send({
          id: user._id,
          company_id: user.company_id.id,
          logo: user.company_id.logo,
          username: user.username,
          email: user.email,
          roles: authorities,
          role: role,
          //accessToken: token
        });
      });

  });


};

exports.changePassword0 = (req, res) => {

  console.log("--change password");
  console.log(req.body.id);
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  var user_id = req.body.id;
  var password = { password: bcrypt.hashSync(req.body.password, 8) };


  User.findByIdAndUpdate(user_id, password, { useFindAndModify: false, omitUndefined: true })
    .then(data => {
      res.send({ message: "user password was updated successfully." });
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving company with id=" + req.body.id + err });
    });


};
exports.changePassword = async (req, res) => {
  console.log("--change password");

  if (!req.body || !req.body.password) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  // 目标用户：未显式指定时默认改自己
  const targetId =  req.userId || req.body.id;

  try {
    const requester = await User.findById(req.userId).populate("roles").exec();
    if (!requester) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    const isAdmin = requester.roles.some(r => r.name === "admin");
    const isSelf = String(targetId) === String(req.userId);

    // 非管理员只能改自己的口令
    if (!isAdmin && !isSelf) {
      return res.status(403).send({ message: "You can only change your own password." });
    }

    // 本人改密必须校验旧口令，防止会话被盗后直接改密
    if (isSelf) {
      const oldValid = bcrypt.compareSync(req.body.oldPassword || "", requester.password);
      if (!oldValid) {
        return res.status(401).send({ message: "Old password is incorrect." });
      }
    }

    const password = { password: bcrypt.hashSync(req.body.password, 8) };

    await User.findByIdAndUpdate(targetId, password, {
      useFindAndModify: false,
      omitUndefined: true
    });

    res.send({ message: "user password was updated successfully." });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error updating password for id=" + targetId + " " + err });
  }
};
