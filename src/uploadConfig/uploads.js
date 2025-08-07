const multer = require('multer');

const fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        if(file.fieldname ==='image') cb(null,  path.join('./public/images'));
        if(file.fieldname ==='pdfFile') cb(null, './public/chars');
      },
      filename: (req, file, cb) => {
        cb(null, randomstring.generate(8) + '_'  + file.originalname);
      }
    });
     
    const fileFilter = (req, file, cb) => {
      console.log(file);
      if(file.fieldname === 'image'){
        if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
          console.log("here");
          cb(null, true);
        }
        cb(null, false);
      }
      else{
      if(file.fieldname === 'pdfFile')
      {
        console.log("here2")
        if(file.mimetype === 'application/pdf'){
         cb(null, true);
        }
        cb(null, false);
      }
    }
    }
const singleImageUpload = multer({storage: fileStorage, limits:{ fileSize: '10mb'}, fileFilter: fileFilter});
const multiUpload = multer({storage: fileStorage, limits:{ fileSize: '10mb'}, fileFilter: fileFilter})//.fields([ {name: 'pdfFile', maxCount: 1}, {name:'image', maxCount: 1}]);

module.exports = singleImageUpload;
module.exports = multiUpload;