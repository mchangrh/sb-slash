const { InteractionResponseType, InteractionResponseFlags } = require('discord-interactions');
const { ApplicationCommandOptionType } = require('slash-commands');
const BASEURL = "https://sponsor.ajay.app/api"
const sbcutil = require('../util/sbc-util.js')
const invalidUUIDResponse = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, that doesn't appear to be a valid public User ID",
    flags: InteractionResponseFlags.EPHEMERAL
  }
}

const userName = (result) => result.vip ? `[VIP] ${result.userName}` : result.userName
const format = (result) => 
 `${userName(result)}
  **Submitted:** ${result.segmentCount}
  **Warnings:** ${result.warnings}
  **Reputation:** ${result.reputation}
  **Segment Views:** ${result.viewCount}
  **Time Saved:** ${sbcutil.minutesReadable(result.minutesSaved)}
  `

module.exports = {
  name: 'userinfo',
  description: 'retreives user info',
  options: [
    {
      name: 'publicid',
      description: 'Public User ID',
      type: ApplicationCommandOptionType.STRING,
      required: true,
    }
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = ((interaction.data.options.find(opt => opt.name === 'publicid') || {}).value || '').trim()
    // check for invalid publicID
    if (!sbcutil.isValidUserUUID(publicid)) return response(invalidUUIDResponse)
    // construct url
    const url = `${BASEURL}/userInfo?publicUserID=${publicid}`
    // fetch
    let res = await fetch(url)
    let body = await res.text()
    const parsed = format(JSON.parse(body)) 
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: parsed,
      },
    });
  }
};
