const express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Trang chủ")
  });

app.get('/products', (req, res) => {
    res.send("Danh sách dự án")
  });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });