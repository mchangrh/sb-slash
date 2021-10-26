module.exports = {
  name: "invite",
  description: "Get a link to invite sb-slash to your server",
  execute: ({ response }) =>
    response({
      type: 4,
      data: {
        embeds: [{
          description: "Click [here](https://sb-slash.mchang.workers.dev/invite) to invite sb-slash to your server",
          color: 0xff0000
        }],
        flags: 64 // hide
      }
    })
};