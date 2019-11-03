const multer = require('multer');
const validator = require('./validator');
const config = require('../config');

function addUploadRoute(server, handler) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, config.filePath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage }).single('package');

  server.post('/packages', upload, validator, handler);

  return server;
}

module.exports = addUploadRoute;
