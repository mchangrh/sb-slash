const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const BASEURL = "https://sponsor.ajay.app/api";
const CATEGORIES = ["all", "sponsor", "intro", "outro", "selfpromo", "interaction", "music_offtopic"];
// eslint-disable-next-line quotes
const ALLCATEGORIES = '["sponsor","intro","outro","selfpromo","interaction","music_offtopic"]';

module.exports = {
  name: "skipsegments",
  description: "Get Segments on Video",
  options: [
    {
      name: "videoid",
      description: "video ID",
      type: ApplicationCommandOptionType.STRING,
      required: true
    },
    {
      name: "category",
      description: "category of segment",
      type: ApplicationCommandOptionType.STRING,
      required: false,
      choices: CATEGORIES.map((category) => ({
        name: category,
        value: category
      }))
    },
    {
      name: "hide",
      description: "Only you can see the response",
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false
    }
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const videoID = ((interaction.data.options.find((opt) => opt.name === "videoid") || {}).value || "").trim();
    const category = ((interaction.data.options.find((opt) => opt.name === "category") || {}).value || "all").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // construct URL
    const categoryParam = (category === "all") ? `categories=${ALLCATEGORIES}` : `category=${category}`;
    const url = `${BASEURL}/skipSegments?videoID=${videoID}&${categoryParam}`;
    // fetch
    let res = await fetch(url);
    let body = await res.text();
    const stringified = (body === "Not Found" ? body : JSON.stringify(JSON.parse(body), null, 4));
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "```json\n"+stringified+"```",
        flags: (hide ? 64 : 0)
      }
    });
  }
};
