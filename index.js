const express = require("express");

const route = require("./routes/index.route");

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", "./views");

route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });