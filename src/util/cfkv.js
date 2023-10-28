// SB, sb-slash testing
const VIPROLES = ["755511470305050715", "930314535963861092"];

const apiURL = "https://mongo.ash.mmpc.me/sb-slash";

const userAPIURL = new URL(apiURL + "/user" + "?auth=" + MONGO_AUTH);

// get existing SBID with cache of 24hr
exports.getSBID = async (dID) => {
  const url = new URL(userAPIURL);
  url.searchParams.append("discordID", dID);
  const result = await fetch(url);
  if (result.ok) return (await result.json()).sbID;
  else return null;
};
exports.deleteSBID = (dID) => {
  const url = new URL(userAPIURL);
  url.searchParams.append("discordID", dID);
  return fetch(url, {method: "DELETE"});
};
exports.postSBID = (dID, SBID) => {
  const url = new URL(userAPIURL);
  url.searchParams.append("discordID", dID);
  url.searchParams.append("sbID", SBID);
  return fetch(url, {method: "POST"});
};
exports.lookupSBID = async (SBID) => {
  const url = new URL(apiURL + "/vip" + "?auth=" + MONGO_AUTH);
  url.searchParams.append("sbID", SBID);
  const result = await fetch(url);
  if (result.ok) return (await result.json()).discordID;
  else return null;
};
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
exports.getLang = async (lang) => {
  const url = new URL(apiURL + "/language" + "?auth=" + MONGO_AUTH);
  url.searchParams.append("lang", lang);
  const result = await fetch(url);
  if (result.ok) return (await result.json());
  else return [];
};
