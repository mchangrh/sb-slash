const VIPROLES = ["755511470305050715", "930314535963861092"];
// SB, sb-slash testing

// get existing SBID with cache of 24hr
export const getSBID = (dID) => NAMESPACE.get(dID, {cacheTtl: 86400});
export const checkVIP = (roles) => VIPROLES.some((viprole) => roles.includes(viprole));
export const vipMap = async (SBID) => {
  const map = await NAMESPACE.get("vipmap", { type: "json"});
  return map[SBID] || null;
};
