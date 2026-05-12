const fs = require("fs");

const deleteImage = (filePath) => {

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

};

module.exports = deleteImage;