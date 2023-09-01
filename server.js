
const express = require("express");
const cors = require("cors");
const app = express();
const initRoutes = require("./src/routes");

global.__basedir = __dirname + "/";

var corsOptions = {
  origin: [ process.env.CLIENT_ORIGIN ,"http://localhost:8080","https://admin_bea.profiles.digital","http://localhost:3000","http://localhost:8081","http://127.0.0.1:3000","http://uat.profiles.digital:3000"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
  
const db = require("./app/models");

 
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

 

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/company.routes")(app);
require("./app/routes/staff.routes")(app);
require("./app/routes/smartcard.routes")(app);
require("./app/routes/upload.routes")(app);
require("./app/routes/vcf_counter.routes")(app);
require("./app/routes/profile_counter.routes")(app);
require("./app/routes/batch_upload.routes")(app);
require("./app/routes/action_log.routes")(app);
require("./app/routes/staff_log.routes")(app);

initRoutes(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT  || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
