module.exports = {
  name: "automod_deny",
  execute: ({ response }) => {
    return response({
      type: 7,
      data: {
        content: "OK",
        flags: 64,
        components: []
      }
    });
  }
};
