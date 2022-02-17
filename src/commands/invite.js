module.exports = {
  name: "invite",
  description: "Get a link to invite sb-slash to your server",
  execute: ({ response }) =>
    response(response(embedResponse("Click [here](https://sb-slash.mchang.workers.dev/invite) to invite sb-slash to your server", true)))
};