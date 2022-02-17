const format = require("../util/formatResponse.js");
const { sendAutoMod } = require("../util/automod.js");
const regex = new RegExp(/(?:https:\/\/bin\.mchang\.xyz\/b\/)(.+)/);
const { videoIDOptional } = require("../util/commandOptions.js");

const findNestedOption = (rootOptions, name) => ((objCheck(rootOptions) && (rootOptions.options.find((opt) => opt.name === name))) || false);
const objCheck = (rootOptions) => (rootOptions && ("options" in rootOptions));

module.exports = {
  name: "automod",
  description: "Get segment suggestion from SponsorBlock ML",
  options: [{
    name: "get",
    description: "Get segment suggestion",
    type: 1,
    options: [videoIDOptional]
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
    return response ({
      type: 4,
      data: {
        content: "DISABLED FOR MIGRATION",
        type: 64
      }
    });
    /*
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
              label: "Continue",
              style: 1,
              custom_id: "automod_deny"
            }, {
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
        const videoID = findNestedOption(rootOptions, "videoid")?.value;
        const message = await sendAutoMod(false, videoID);
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
      const missedSuggestions = [];
      const incorrectSubmissions = [];
      const suggestArray = await fetch(url)
        .then((result) => result.text())
        .then((text) => text.split("\n"));
      // try parse json
      for (const suggest of suggestArray) {
        try {
          const result = JSON.parse(suggest);
          if (!result?.missed?.length) {
            missedSuggestions.push(result);
          } else {
            incorrectSubmissions.push(result);
          }
        } catch (err) {
          console.log(err);
        }
      }
      const promiseArray = missedSuggestions
        .flatMap((suggest) => XENOVA_ML.put("missed:"+suggest.video_id, JSON.stringify(suggest)));
      promiseArray.push(incorrectSubmissions
        .flatMap((suggest) => XENOVA_ML.put("incorrect:"+suggest.video_id, JSON.stringify(suggest))));
      await Promise.all(promiseArray);
      return response(format.contentResponse(`✅ Loaded ${acceptedSuggestions?.length} missed suggestions and ${incorrectSubmissions?.length} incorrect submissions from ${suggestArray.length} lines`, true));
    }
    */
  }
};
