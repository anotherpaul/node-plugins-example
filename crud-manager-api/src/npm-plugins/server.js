const multer = require('multer');
const validator = require('./validator');
const config = require('../config');
const logger = require('../logger');

function addUploadRoute(server, uploadPackage) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, config.filePath);
    },
    filename: (req, file, cb) => {
      logger.log(`uploaded ${file.originalname}`);
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage }).single('package');

  server.post('/packages', upload, validator, uploadPackage);

  return server;
}

module.exports = addUploadRoute;
