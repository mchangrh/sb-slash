// user checks
const userStrictRegex = new RegExp(/^[a-f0-9]{64}$/);
const userLinkRegex = new RegExp(/(?:^|^https:\/\/sb.ltn.fi\/userid\/)([a-f0-9]{64})(?:$|\/$)/);
const userStrictCheck = (str) => userStrictRegex.test(str);
const userLinkCheck = (str) => userLinkRegex.test(str);
const userLinkExtract = (str) => str.match(userLinkRegex)[1];
// segment
const segmentRegex = "[a-f0-9]{64,65}";
const segmentStrictRegex = new RegExp(`^${segmentRegex}$`);
const segmentStrictCheck = (str) => segmentStrictRegex.test(str);
const segmentGeneralRegex = new RegExp(`(?:^|\\W)(${segmentRegex})(?:$|\\W)`);
const findSegmentUUID = (str) => segmentGeneralRegex.test(str) ? str.match(segmentGeneralRegex)[1] : null;
// video ID
const videoRegex = "([0-9A-Za-z_-]{11})"; // group to always be index 1
const urlVideoRegexp = new RegExp(`(?:v=|/|youtu.be/)${videoRegex}(?:|/|[?&]t=\\d+s?)>?(?:\\s|$)`);
const onlyVideoRegexp = new RegExp(`^${videoRegex}$`);
const findVideoID = (str) => {
  if (urlVideoRegexp.test(str)) {
    return str.match(urlVideoRegexp)[1];
  } else if (onlyVideoRegexp.test(str)) {
    return str.match(onlyVideoRegexp)[1];
  } else {
    return null;
  }
};
const strictVideoID = (str) => onlyVideoRegexp.test(str);

module.exports = {
  // user
  userStrictCheck,
  userLinkCheck,
  userLinkExtract,
  // segment
  segmentStrictCheck,
  findSegmentUUID,
  // videoID
  findVideoID,
  strictVideoID
};
