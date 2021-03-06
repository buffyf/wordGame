const indexRoutes = require("./routes/indexRoutes");
const wordRoutes = require("./routes/wordRoutes");
const newgameRoutes = require("./routes/newgameRoutes");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const logger = require("morgan");
const sessionConfig = require("./sessionConfig");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;

//templating engine
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

//middleware
app.use(express.static(path.join(__dirname, "./public")));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));

//ROUTES
app.use("/", indexRoutes);
app.use("/word", wordRoutes);
app.use("/newgame", newgameRoutes);



app.listen(port, () => {
    console.log(`running on port: ${port}`);
});