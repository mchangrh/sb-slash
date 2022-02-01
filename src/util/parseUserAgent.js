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

exports.parseUserAgent = (userAgent) => {
  const ua = userAgent.toLowerCase();
  if (ua.startsWith(uaArray.chromium)) {
    return `<:chromium:882089632731369522>/${versionRegex(ua, uaArray.chromium)}`;
  } else if (ua.startsWith(uaArray.edge)) {
    return `<:edge:882089632471347292>/${versionRegex(ua, uaArray.edge)}`;
  } else if (ua.startsWith(uaArray.firefox)) {
    return `<:firefox:882089632777523200>/${versionRegex(ua, uaArray.firefox)}`;
  } else if (ua.startsWith(uaArray.vanced)) {
    return `<:vanced:882089632555216916>/${versionRegex(ua, uaArray.vanced)}`;
  } else if (ua.startsWith(uaArray.mpv)) {
    return `<:mpv:882089632681058374>/${versionRegex(ua, uaArray.mpv)}`;
  } else if (ua.startsWith(uaArray.node)) {
    return `Node/${versionRegex(ua, uaArray.node)}`;
  } else {
    return ua || "none";
  }
};