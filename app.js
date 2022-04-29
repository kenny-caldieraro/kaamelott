require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./app/router");
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./app/views");
app.use(express.static("public"));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
