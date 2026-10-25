const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.users;
const { authJwt } = require("../middleware");
const getPagination = (page, size) => {
  const limit = size ? +size : 5;

  const offset = page ? page * limit : 0;
  return { limit, offset };
};


exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

const populate = ['company_id', 'roles'];


exports.findAll = (req, res) => {
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { username: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage - 1, pageSize);
  var sort = orderBy ? { [orderBy]: 1 } : {};
  User.paginate(condition, { populate, offset, limit, sort, select: "-password" })
    .then(data => {
      res.send({
        status: data.status,
        totalItem: data.totalDocs,
        totalPage: data.totalPages,
        currentPage: data.page,
        pageSize: pageSize * 1,
        data: data.docs,
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving staffs."
      });
    });
};
// Find a single company with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found company with id " + id });
      else {
        res.send(data);
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving company with id=" + id });
    });
};
// 管理员可写字段（含高危字段）
const ADMIN_WRITABLE_FIELDS = ["username", "email", "company_id", "password", "status", "roles"];
// 普通用户可写字段（不允许改 roles / status / company_id，杜绝提权）
const SELF_WRITABLE_FIELDS = ["username", "email", "password"];

// Update a company by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  try {

    console.log("req.userId", req.userId, "id", id);
     // 行级授权：仅管理员可改他人；普通用户只能改自己
    const isAdmin = await authJwt.checkAdmin(req.userId);
     const isSelf = String(id) === String(req.userId);

    if (!isAdmin && !isSelf) {
      return res.status(403).send({
        message: "You can only update your own profile."
      });
    }

    const allowed = isAdmin ? ADMIN_WRITABLE_FIELDS : SELF_WRITABLE_FIELDS;
    const data = {};
    Object.keys(req.body).forEach((k) => {
      if (allowed.includes(k) && req.body[k] !== "") {
        data[k] = req.body[k];
      }
    });

    if (Object.keys(data).length === 0) {
      return res.status(400).send({ message: "No permitted fields to update." });
    }

    if (data.password !== undefined) {
      data.password = bcrypt.hashSync(data.password, 8);
    }

    const updated = await User.findByIdAndUpdate(id, data, {
      useFindAndModify: false,
      omitUndefined: true,
    });

    if (!updated) {
      return res.status(404).send({
        message: `Cannot update user with id=${id}. Maybe user was not found!`
      });
    }
    res.send({ message: "user was updated successfully." });
  } catch (err) {
    res.status(500).send({
      message: "Error updating user with id=" + id
    });
  }
};

// Delete an user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`
        });
      } else {
        res.send({
          message: "user was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete user with id=" + id
      });
    });
};

// Delete all users from the database.
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};


exports.findAllActive = (req, res) => {
  User.find({ status: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};
