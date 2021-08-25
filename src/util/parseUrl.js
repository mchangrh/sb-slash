const videoIDRegexp = new RegExp(/(?:[/=])([0-9A-Za-z_-]{11})/);
const findVideoID = (str) => {
  const matches = str.match(videoIDRegexp);
  return matches ? matches[1] : null;
};

module.exports = {
  findVideoID
};