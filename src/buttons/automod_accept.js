module.exports = {
  name: "automod_accept",
  execute: async ({ interaction, response }) => {
    const dID = interaction?.member?.user.id || interaction.user.id;
    const allowArr = await USERS.get("ml_allow", { type: "json" });
    // only push if not in array already
    if (!allowArr.allow.includes(dID)) allowArr.allow.push(dID);
    await USERS.put("ml_allow",JSON.stringify(allowArr));
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
