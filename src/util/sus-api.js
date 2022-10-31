const apiURL = "https://sb.minibomba.pro/bot_check";

// get existing SBID with cache of 24hr
exports.isSus = (publicid) =>
  fetch(`${apiURL}/${publicid}?key=${SUS_KEY}`);
