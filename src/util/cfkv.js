// SB, sb-slash testing
const VIPROLES = ["755511470305050715", "930314535963861092"];

// get existing SBID with cache of 24hr
exports.getSBID = (dID) => NAMESPACE.get(dID, {cacheTtl: 86400});
exports.checkVIP = (roles) => VIPROLES.some((viprole) => roles.includes(viprole));
exports.vipMap = async (SBID) => {
  const map = await NAMESPACE.get("vipmap", { type: "json"});
  return map?.[SBID];
};