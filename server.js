
const express = require("express");
const cors = require("cors");
const app = express();

global.profileUrl="https://ebcard.hkbea.digital/?key=";
global.__basedir = __dirname + "/";
global.trustedIps = ['223.16.51.58','210.176.64.1','210.176.64.2','210.176.64.3','210.176.64.4','210.176.64.5','210.176.64.6','210.176.64.7','210.176.64.8','210.176.64.9','210.176.64.10','210.176.64.11','210.176.64.12','210.176.64.13','210.176.64.14','210.176.64.15','210.176.64.16','210.176.64.17','210.176.64.18','210.176.64.19','210.176.64.20','210.176.64.21','210.176.64.22','210.176.64.23','210.176.64.24','210.176.64.25','210.176.64.26','210.176.64.27','210.176.64.28','210.176.64.29','210.176.64.30','103.243.0.65','103.243.0.66','103.243.0.67','103.243.0.68','103.243.0.69','103.243.0.70','103.243.0.71','103.243.0.72','103.243.0.73','103.243.0.74','103.243.0.75','103.243.0.76','103.243.0.77','103.243.0.78'];

var corsOptions = {
  origin: [ process.env.CLIENT_ORIGIN ,"http://localhost:8080","https://admin-ebcard.hkbea.digital","http://localhost:3000","http://localhost:8081","http://127.0.0.1:3000","http://ebcard.hkbea.digital"]
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
 
//initRoutes(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT  || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
