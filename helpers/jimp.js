const Jimp = require("jimp");

const resizeAvatar = (filename) => {
  Jimp.read(filename, (err, lenna) => {
    if (err) throw err;
    lenna.resize(250, 250);
  });
};

module.exports = resizeAvatar;
