const ML_URL = "https://sb-ml.mchang.xyz";
const AUTH_URL = (path) => new URL(`${ML_URL}/${path}?auth=${ML_AUTH}`);

exports.get = (options) => {
  const url = AUTH_URL("get");
  for (const [key, value] of Object.entries(options)) {
    url.searchParams.append(key, value);
  }
  return fetch(url);
};
exports.done = (videoID) => fetch(`${AUTH_URL("done")}&video_id=${videoID}`);
exports.reject = (videoID) => fetch(`${AUTH_URL("reject")}&video_id=${videoID}`);
exports.info = () => fetch(`${AUTH_URL("info")}`);