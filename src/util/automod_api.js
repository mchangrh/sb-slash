const ML_URL = "https://sb-ml.mchang.xyz";
const AUTH_URL = (path) => `${ML_URL}/${path}?auth=${ML_AUTH}`;

exports.get = (videoID = null) => {
  const url = videoID ? `${AUTH_URL("get")}&video_id=${videoID}` : `${AUTH_URL("get")}`;
  return fetch(url);
};

exports.done = (videoID) => fetch(`${AUTH_URL("done")}&video_id=${videoID}`);
exports.reject = (videoID) => fetch(`${AUTH_URL("reject")}&video_id=${videoID}`);
exports.info = () => fetch(`${AUTH_URL("info")}`);