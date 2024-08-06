const versionRegex = (uaString, prefix) => {
  const regex = new RegExp(prefix + "/[^\\s]+");
  return uaString.match(regex)?.[1] ?? uaString.split("/")?.[1] ?? "?";
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
    return `<:chromium:1270521580161732629>/${versionRegex(ua, uaArray.chromium)}`;
  } else if (ua.startsWith(uaArray.edge)) {
    return `<:edge:1270522404052930560>/${versionRegex(ua, uaArray.edge)}`;
  } else if (ua.startsWith(uaArray.firefox)) {
    return `<:firefox:1270521540181757962>/${versionRegex(ua, uaArray.firefox)}`;
  } else if (ua.startsWith(uaArray.vanced)) {
    return `<:vanced:1270521638357565521>/${versionRegex(ua, uaArray.vanced)}`;
  } else if (ua.startsWith(uaArray.mpv)) {
    return `<:mpv:1270521562864418816>/${versionRegex(ua, uaArray.mpv)}`;
  } else if (ua.startsWith(uaArray.node)) {
    return `<node:1270522693078225077>/${versionRegex(ua, uaArray.node)}`;
  } else if (/[a-z]{32}\/v[\d.]+/.test(ua)) {
    return `<:chromium:1270521580161732629> -like/${versionRegex(ua, "")}`;
  } else {
    return ua || "none";
  }
};
