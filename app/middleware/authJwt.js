const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;
const Role = db.roles;

// 从请求头中提取 JWT：兼容 x-access-token 与标准 Authorization: Bearer
function extractToken(req) {
  let token = req.headers["x-access-token"];
  if (!token) {
    const auth = req.headers["authorization"];
    if (auth && auth.startsWith("Bearer ")) {
      token = auth.slice(7);
    }
  }
  return token;
}

const verifyToken = (req, res, next) => {
 const token = extractToken(req);
 
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "user" || roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

// 判断当前请求者是否为管理员（供控制器内部做行级授权使用）
const checkAdmin = (userId) =>
  new Promise((resolve, reject) => {
    User.findById(userId).exec((err, user) => {
      if (err) return reject(err);
      if (!user) return resolve(false);
      Role.find({ _id: { $in: user.roles } }, (err, roles) => {
        if (err) return reject(err);
        resolve(roles.some((r) => r.name === "admin"));
      });
    });
  });

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  checkAdmin
};

 
module.exports = authJwt;
