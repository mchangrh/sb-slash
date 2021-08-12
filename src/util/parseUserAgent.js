const versionRegex = (uaString, prefix) => {
  const regex = new RegExp(prefix + "/[^\\s]+");
  return uaString.match(regex)[1] || uaString.split("/")[1];
};

const uaArray = {
  chromium: "mnjggcdmjocbbbhaepdhchncahnbgone",
  edge: "mbmgnelfcpoecdepckhlhegpcehmpmji",
  firefox: "sponsorblocker@ajay.app",
  vanced: "vanced",
  mpv: "mpv_sponsorblock",
  node: "node_sponsorblock"
};

const parseUserAgent = (userAgent) => {
  const ua = userAgent.toLowerCase();
  if (ua.startsWith(uaArray.chromium)) {
    return `Chromium/${versionRegex(ua, uaArray.chromium)}`;
  } else if (ua.startsWith(uaArray.edge)) {
    return `Edge/${versionRegex(ua, uaArray.edge)}`;
  } else if (ua.startsWith(uaArray.firefox)) {
    return `Firefox/${versionRegex(ua, uaArray.firefox)}`;
  } else if (ua.startsWith(uaArray.vanced)) {
    return `Vanced/${versionRegex(ua, uaArray.vanced)}`;
  } else if (ua.startsWith(uaArray.mpv)) {
    return `mpv/${versionRegex(ua, uaArray.mpv)}`;
  } else if (ua.startsWith(uaArray.node)) {
    return `Node/${versionRegex(ua, uaArray.node)}`;
  } else {
    return ua ? ua : "none";
  }
};

module.exports = {
  parseUserAgent
};