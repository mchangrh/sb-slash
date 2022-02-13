module.exports = {
  name: "automod_accept",
  execute: async ({ interaction, response }) => {
    const dID = interaction?.member?.user.id || interaction.user.id;
    const allowArr = await NAMESPACE.get("ml_allow", { type: "json" });
    allowArr.allow.push(dID);
    await NAMESPACE.put("ml_allow",JSON.stringify(allowArr));
    return response({
      type: 7,
      data: {
        content: "Added to allow list. Please wait for the list to update ",
        flags: 64,
        components: []
      }
    });
  }
};
