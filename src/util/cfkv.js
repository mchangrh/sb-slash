// SB, sb-slash testing
const VIPROLES = ["755511470305050715", "930314535963861092"];

// get existing SBID with cache of 24hr
exports.getSBID = (dID) => NAMESPACE.get(dID, {cacheTtl: 86400});
exports.checkVIP = async (dUser) => {
  if (!dUser) return false;
  const dID = dUser.user.id;
  // check against roles
  if (VIPROLES.some((viprole) => dUser.roles.includes(viprole))) {
    // 1 week expiry on user key
    await USERS.put(dID, VIP_NONCE, { expirationTtl: 604800 });
    return true;
  } else {
    // check against cache
    const vipCache = await USERS.get(dID);
    return vipCache === VIP_NONCE && dID;
  }
};
exports.vipMap = async (SBID) => {
  const map = await USERS.get("vipmap", { type: "json"});
  return map?.[SBID];
};
