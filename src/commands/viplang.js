const { languageRequired } = require("../util/commandOptions.js");
const { getLang } = require("../util/cfkv.js");

module.exports = {
  name: "viplang",
  description: "Retrieve VIP Languages",
  options: [
    languageRequired
  ],
  execute: async ({ interaction, response }) => {
    // check that user is VIP
    const dUser = interaction?.member;
    const isVIP = await checkVIP(dUser);
    if (!isVIP) return response(notVIP);
    const language = nested("lang");
    const res = await getLang(language)
      .catch((err) => apiErr(err));
    // remove non-pingable users
    const users = res
      .filter((user) => user?.ping !== false)
      .map((user) => `<@!${user}>`).join("\n");
    return response(contentResponse(users, false));
  }
};
