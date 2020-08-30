const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

const PORT = process.env.PORT || 8080;
require("dotenv").config();
const session = require("express-session");
var SequelizeStore = require("connect-session-sequelize")(session.Store);

const db = require("./models");
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const origins = [
  'http://localhost:3000', // Development
  'http://you-tutor.herokuapp.com', // Just for debugging reasons
  'https://you-tutor.herokuapp.com',
  'http://www.you-tutor.com/profile'
];

app.use(
  cors({

    origin: origins,

    // origin: ["http://localhost:3000"],
    // origin: ["http://www.you-tutor.com","https://you-tutor.herokuapp.com","http://localhost:3000"],
    origin: ["http://www.you-tutor.com"],

    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
      db: db.sequelize,
    }),
    proxy : true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
  })
);
app.enable('trust proxy');

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
