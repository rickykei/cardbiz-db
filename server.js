const express = require("express");
const cors = require("cors");

const app = express();
const initRoutes = require("./src/routes");

var corsOptions = {
  origin: ["https://admin.e-profile.digital","http://cardbiz.rossfoundry.com:3000","http://localhost:3000","http://localhost:8081","http://127.0.0.1:3000","http://e-profile.digital:3000"]
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
require("./app/routes/turorial.routes")(app);
require("./app/routes/staff.routes")(app);
require("./app/routes/smartcard.routes")(app);
require("./app/routes/upload.routes")(app);
require("./app/routes/vcf_counter.routes")(app);
require("./app/routes/profile_counter.routes")(app);


initRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
