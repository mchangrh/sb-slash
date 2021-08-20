const videoIDRegexp = new RegExp(/[0-9A-Za-z_-]{10}/)
const findVideoID = (str) => str.match(videoIDRegexp)[0]

module.exports = {
  findVideoID
};