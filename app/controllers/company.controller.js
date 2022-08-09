const db = require("../models");
const Company = db.companies;

// Create and Save a new company
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a company
  const company = new Company({
    name: req.body.name,
    code: req.body.code,
    no_of_license: req.body.no_of_license,
    no_of_admin: req.body.no_of_admin,
    status: req.body.status ? req.body.status : false
  });

  // Save company in the database
  company
    .save(company)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the company."
      });
    });
};

// Retrieve all company from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Company.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving companies."
      });
    });
};

// Find a single company with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Company.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found company with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving company with id=" + id });
    });
};

// Update a company by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Company.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update company with id=${id}. Maybe company was not found!`
        });
      } else res.send({ message: "company was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating company with id=" + id
      });
    });
};

// Delete a company with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Company.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete company with id=${id}. Maybe company was not found!`
        });
      } else {
        res.send({
          message: "company was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete company with id=" + id
      });
    });
};

// Delete all companies from the database.
exports.deleteAll = (req, res) => {
  Company.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} companyies were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all companies."
      });
    });
};

// Find all published companyies
exports.findAllActive = (req, res) => {
  Company.find({ status: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving companyies."
      });
    });
};
