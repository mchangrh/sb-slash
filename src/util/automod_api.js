const ML_URL = "https://sb-ml.mchang.xyz";

exports.get = (videoID = null) => {
  const url = videoID ? `${ML_URL}/get?auth=${ML_AUTH}&video_id=${videoID}` : `${ML_URL}/get?auth=${ML_AUTH}`;
  return fetch(url);
};

exports.done = (videoID) => fetch(`${ML_URL}/done?auth=${ML_AUTH}&video_id=${videoID}`);
exports.reject = (videoID) => fetch(`${ML_URL}/reject?auth=${ML_AUTH}&video_id=${videoID}`);