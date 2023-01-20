exports.log = (user, cmdname, target) => {
  const username = `${user.username}#${user.discriminator}`;
  const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
  const rawText = `${cmdname} | \`${target}\``;
  const request = {
    body: `{
      "content": "${rawText}",
      "username": "${username}",
      "avatar_url": "${avatar}"
    }`,
    method: "POST",
    headers: { "content-type": "application/json;charset=UTF-8" }
  };
  return fetch(LOGGING_WEBHOOK, request);
};

exports.logEmbed = (user, embed) => {
  delete embed.type; // remove rich type
  const username = `${user.username}#${user.discriminator}`;
  const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
  const request = {
    body: `{
      "content": "suslist ban",
      "username": "${username}",
      "avatar_url": "${avatar}",
      "embeds": [${JSON.stringify(embed)}]
    }`,
    method: "POST",
    headers: { "content-type": "application/json;charset=UTF-8" }
  };
  return fetch(LOGGING_WEBHOOK, request);
};
