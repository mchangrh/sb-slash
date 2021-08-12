const versionRegex = (uaString, prefix) => {
  const regex = new RegExp(prefix + "/[^\\s]+");
  return uaString.match(regex)[1] || uaString.split("/")[1];
};

const uaArray = {
  chromium: "mnjggcdmjocbbbhaepdhchncahnbgone",
  edge: "mbmgnelfcpoecdepckhlhegpcehmpmji",
  firefox: "sponsorBlocker@ajay.app",
  vanced: "vanced",
  mpv: "mpv_sponsorblock",
  node: "node_sponsorblock"
};

const parseUserAgent = (userAgent) => {
  const ua = userAgent.toLowerCase();
  if (ua.startsWith(uaArray.chromium)) {
    return `<:chromium:871511147017306123> Chromium/${versionRegex(ua, uaArray.chromium)}`;
  } else if (ua.startsWith(uaArray.edge)) {
    return `<:edge:871513299643146301> Edge/${versionRegex(ua, uaArray.edge)}`;
  } else if (ua.startsWith(uaArray.firefox)) {
    return `<:firefox:871495890286825472> Firefox/${versionRegex(ua, uaArray.firefox)}`;
  } else if (ua.startsWith(uaArray.vanced)) {
    return `<:vancedlogo:833709207056154634> Vanced/${versionRegex(ua, uaArray.vanced)}`;
  } else if (ua.startsWith(uaArray.mpv)) {
    return `<:mpv:871496580782489660> mpv/${versionRegex(ua, uaArray.mpv)}`;
  } else if (ua.startsWith(uaArray.node)) {
    return `Node/${versionRegex(ua, uaArray.node)}`;
  } else {
    return ua ? ua : "none";
  }
};

module.exports = {
  parseUserAgent
};