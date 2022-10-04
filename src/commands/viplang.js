const { languageRequired, findOption } = require("../util/commandOptions.js");
const { checkVIP, getLang } = require("../util/cfkv.js");
const { contentResponse } = require("../util/discordResponse.js");

const apiErr = (error) => {
  // eslint-disable-next-line no-console
  console.log(error);
  throw "api error";
};

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
    const language = findOption(interaction, "lang");
    const res = await getLang(language)
      .catch((err) => apiErr(err));
    // remove non-pingable users
    const users = res
      .filter((user) => user?.ping !== false)
      .map((user) => `<@!${user}>`).join("\n");
    return response(contentResponse(users, false));
  }
};
