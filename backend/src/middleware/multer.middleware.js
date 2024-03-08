const multer = require("multer");


// const multerFilter = (req, file, cb) => {
//   // Check if the file is an image based on its mimetype
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true); // Accept the file
//   } else {
//     cb({ message: "Unsupported File Format" }, false); // else reject it
//   }
// };

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/upload");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });
  
  const upload = multer({
    storage: storage,
  });


  module.exports = upload;