
const express = require("express");
const indexRoutes = express.Router();
const app = express();

app.use("/", indexRoutes);

indexRoutes.get("/", (req, res) => {
    res.render("index", req.session)
});

module.exports = indexRoutes;

