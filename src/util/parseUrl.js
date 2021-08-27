const idRegex = "([0-9A-Za-z_-]{11})"; // group to always be index 1
const urlIDRegexp = new RegExp(`(?:v=|/)${idRegex}(?:$|/$|[?&]t=\\d+$)`);
const onlyIDRegexp = new RegExp(`^${idRegex}$`);
const anyIDRegexp = new RegExp(idRegex);
exports.findVideoID = (str) => {
  if (urlIDRegexp.test(str)) {
    return str.match(urlIDRegexp)[1];
  } else if (onlyIDRegexp.test(str)) {
    return str.match(onlyIDRegexp)[1];
  } else if (anyIDRegexp.test(str)) {
    return str.match(anyIDRegexp)[1];
  } else {
    return null;
  }
};

exports.strictVideoID = (str) => onlyIDRegexp.test(str);