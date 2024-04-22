const express = require("express");
const dotenv = require("dotenv");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require("moment");
const path = require('path');
  
dotenv.config();

database.connect();

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

// Flash
app.use(cookieParser('ADASCZXC'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
// ./ là đứng từ thư mục gốc
// ${__dirname} là thư mục gốc

app.use(express.static(`${__dirname}/public`));

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Để xét phần bodyParser được gửi lên dưới dạng form

// App Locals Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;


/* New Route to the TinyMCE Node module */
// path để nối các chuỗi đó thành 1 đường dẫn hoàn chỉnh
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Routes
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });