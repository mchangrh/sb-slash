const format = require("../util/formatResponse.js");
const { sendAutoMod } = require("../util/automod.js");
const regex = new RegExp(/(?:https:\/\/bin\.mchang\.xyz\/b\/)(.+)/);

const findNestedOption = (rootOptions, name) => ((objCheck(rootOptions) && (rootOptions.options.find((opt) => opt.name === name))) || false);
const objCheck = (rootOptions) => (rootOptions && ("options" in rootOptions));

module.exports = {
  name: "automod",
  description: "Get segment suggestion from SponsorBlock ML",
  options: [{
    name: "get",
    description: "Get segment suggestion",
    type: 1
  }, {
    name: "acceptterms",
    description: "Accept terms",
    type: 1
  }, {
    name: "load",
    description: "Load segment suggestion (Admin only)",
    type: 1,
    options: [{
      name: "binid",
      description: "bin ID for example text file (https://bin.mchang.xyz/upload)",
      type: 3,
      required: true
    }]

  }],
  execute: async ({ interaction, response }) => {
    const rootOptions = interaction.data.options[0];
    const cmdName = rootOptions.name;
    const dID = interaction?.member?.user.id || interaction.user.id;
    if (cmdName === "acceptterms") {
      return response({
        type: 4,
        data: {
          content: "Please read over the disclaimers regarding [Automating Submissions](https://wiki.sponsor.ajay.app/w/Automating_Submissions). Your publicID will be allowlisted",
          flags: 64,
          components: [{
            type: 1,
            components: [{
              type: 2,
              label: "I have read over the disclaimers",
              style: 4,
              custom_id: "automod_accept"
            }]
          }]
        }
      });
    } else if (cmdName === "get") {
      const allowList = await NAMESPACE.get("ml_allow", { type: "json" });
      if (allowList.allow.includes(dID)) {
        const message = await sendAutoMod(false);
        return response(message);
      } else {
        return response(format.contentResponse("You are not allowlisted for automod - run /automod acceptterms", true));
      }
    } else if (cmdName === "load") {
      // Xenova, blab, E.Coli
      const authorizedLoaders = ["234763281749770243", "162333087621971979", "323277403608580097"];
      if (!authorizedLoaders.includes(dID)) {
        return response(format.contentResponse("You are not authorized to use this command.", true));
      }
      // get params from discord
      let binID = findNestedOption(rootOptions, "binid")?.value;
      if (regex.test(binID)) binID = binID.match(regex)[1];
      const url = `https://bin.mchang.xyz/b/${binID}`;
      const acceptedSuggestions = [];
      const suggestArray = await fetch(url)
        .then((result) => result.text())
        .then((text) => text.split("\n"));
      // try parse json
      for (const suggest of suggestArray) {
        try {
          const result = JSON.parse(suggest);
          acceptedSuggestions.push(result);
        } catch (err) {
          console.log(err);
        }
      }
      const promiseArray = acceptedSuggestions
        .flatMap((suggest) => XENOVA_ML.put(suggest.video_id, JSON.stringify(suggest)));
      await Promise.all(promiseArray);
      return response(format.contentResponse(JSON.stringify(acceptedSuggestions[0])));
    }
  }
};