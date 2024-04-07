const multer  = require('multer');

module.exports = multer.diskStorage({
    destination: function (req, file, cb)// định nghĩa đường dẫn folder để lưu ảnh
    {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + "-" + file.originalname;
      cb(null, filename);
    }// thiết lập tên file ảnh up lên, Data.now là thời gian hiện tại, file.originalname là tên file up lên
  })// đổi tên cho img upload