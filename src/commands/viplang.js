const { languageRequired, findOption } = require("../util/commandOptions.js");
const { notVIP } = require("../util/invalidResponse.js");
const { checkVIP, getLang } = require("../util/cfkv.js");
const { pingResponse } = require("../util/discordResponse.js");
var flag = require("emoji-flag");

const apiErr = (error) => {
  // eslint-disable-next-line no-console
  console.log(error);
  throw "api error";
};

module.exports = {
  name: "viplang",
  description: "Retrieve VIP Languages",
  options: [
    languageRequired,
    {
      name: "ping",
      description: "ping the users",
      type: 5,
      required: false
    }
  ],
  execute: async ({ interaction, response }) => {
    // check that user is VIP
    const dUser = interaction?.member;
    const isVIP = await checkVIP(dUser);
    if (!isVIP) return response(notVIP);
    const language = findOption(interaction, "lang");
    const ping = findOption(interaction, "ping") || false;
    const res = await getLang(language)
      .catch((err) => apiErr(err));
    // remove non-pingable users
    const users = res
      .filter((user) => user?.ping !== false)
      .map((user) => `<@!${user.user}>`).join(", ");
    return response(pingResponse(flag(language.toUpperCase()) + ": " + users, false, ping));
  }
};
