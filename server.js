const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const db = require("./models");

const PORT = process.env.PORT || 8080;
require("dotenv").config();
const session = require("express-session");
var SequelizeStore = require("connect-session-sequelize")(session.Store);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
      db: db.sequelize,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
      samesite:'strict',
      secure:true
    },
  })
);



app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(
  cors({
    // origin: ["http://localhost:3000"],
    origin: ["https://you-tutor.herokuapp.com","http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.static("public"));

const logInRoute = require("./controllers/loginController.js");
const studentRoute = require("./controllers/studentController.js");
const reviewRoute = require("./controllers/reviewController.js");
const signupRoute = require("./controllers/signupController.js");
const teacherRoute = require("./controllers/teacherController.js");
const filterRoute = require("./controllers/filterController.js");
const matchingRoute = require("./controllers/matchingController.js");

app.use(logInRoute);
app.use(studentRoute);
app.use(reviewRoute);
app.use(signupRoute);
app.use(teacherRoute);
app.use(filterRoute);
app.use(matchingRoute);

db.sequelize
  .sync({
    force: false,
  })
  .then(function () {
    app.listen(PORT, function () {
      console.log("App listening on PORT " + PORT);
    });
  })
  .catch((err) => {
    throw err;
  });
