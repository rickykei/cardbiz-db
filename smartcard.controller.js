const db = require("../models");
const Smartcard = db.smartcards;
const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page* limit : 0;
  return { limit, offset };
};
// Create and Save a new smartcards
exports.create = (req, res) => {
  // Validate request
  if (!req.body.uid) {
    res.status(400).send({ message: "uid can not be empty!" });
    return;
  }

  // Create a smartcard
  const smartcard = new Smartcard({
    uid: req.body.uid,
     status: req.body.status ? req.body.status : false
  });

  // Save smartcard in the database
  smartcard
    .save(smartcard)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the smartcard."
      });
    });
};

// Retrieve all smartcard from the database.
exports.findAll = (req, res) => {
  const { currentPage, pageSize, search, orderBy } = req.query;
  var condition = search ? { name: { $regex: new RegExp(search), $options: "i" } } : {};
  const { limit, offset } = getPagination(currentPage-1, pageSize);
  var  sort = orderBy? {[orderBy] : 1 }:{};
  Smartcard.paginate(condition, { offset, limit , sort})
    .then((data) => {
      res.send({
        status: data.status,
        totalItem: data.totalDocs,
        totalPage: data.totalPages,
        currentPage: data.page,
        pageSize: pageSize*1,
        data: data.docs,
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving companies."
      });
    });
};

// Find a single smartcard with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log("find"+id);
  Smartcard.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found smartcard with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving smartcard with id=" + id });
    });
};

// Update a smartcard by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Smartcard.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update smartcard with id=${id}. Maybe smartcard was not found!`
        });
      } else res.send({ message: "smartcard was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating smartcard with id=" + id
      });
    });
};

// Delete a smartcard with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
console.log("del="+id);
  Smartcard.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete company with id=${id}. Maybe company was not found!`
        });
      } else {
        res.send({
          message: "smartcard was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete smartcard with id=" + id
      });
    });
};

// Delete all companies from the database.
exports.deleteAll = (req, res) => {
  Smartcard.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} smartcards were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all smartcard."
      });
    });
};

// Find all published smartcard
exports.findAllActive = (req, res) => {
  Smartcard.find({ status: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving smartcard."
      });
    });
};

 