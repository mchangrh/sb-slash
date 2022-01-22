const log = (user, cmdname, target) => {
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

module.exports = {
  log
};