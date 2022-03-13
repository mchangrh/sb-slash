const embedResponse = (embed, hide = true) => {
  return {
    type: 4,
    data: {
      embeds: [embed],
      flags: (hide ? 64 : 0)
    }
  };
};

const contentResponse = (content, hide = true) => {
  return {
    type: 4,
    data: {
      content,
      flags: (hide ? 64 : 0)
    }
  };
};

module.exports = {
  embedResponse,
  contentResponse
};