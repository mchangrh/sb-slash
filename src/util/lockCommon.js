const { vip } = require("./min-api.js");
const { EMOJI_ID_MAP, CATEGORY_LONGNAMES } = require("sb-category-type");
const { checkVIP } = require("./cfkv.js");

function actionRow(component) {
  return [{
    type: 1,
    components: [component]
  }];
}

const lockResponse = (body, footer = true) => {
  const embed = {
    title: "Lock Video",
    url: `https://www.youtube.com/watch?v=${body.videoID}`,
    color: 0xffc83d,
    fields: [],
    footer: {}
  };
  Object.entries(body).forEach(([key, value]) => {
    embed.fields.push({
      name: key,
      value: `\`${value}\``
    });
  });
  if (footer) embed.footer.text = JSON.stringify(body);
  return embed;
};

const lockLog = (user, embed) => {
  const webhookBody = {
    username: `${user.username}#${user.discriminator}`,
    avatar_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
    embeds: [embed]
  };
  const request = {
    body: JSON.stringify(webhookBody),
    method: "POST",
    headers: { "content-type": "application/json;charset=UTF-8" }
  };
  return fetch(LOGGING_WEBHOOK, request);
};

const categoryOptions = Object.entries(CATEGORY_LONGNAMES).map((obj) => {
  return { label: obj[0], value: obj[1], emoji: EMOJI_ID_MAP[obj[1]] };
});

const categoryComponent = {
  // category select
  type: 3,
  custom_id: "lock_category_select",
  placeholder: "Choose Categories",
  min_values: 1,
  max_values: 10,
  options: categoryOptions
};

const typeComponent = {
  // lock type
  type: 3,
  custom_id: "lock_type_select",
  placeholder: "Choose Skip Type",
  min_values: 1,
  max_values: 3,
  options:[{
    value: "skip", label: "Skip",
    emoji: { name: "⏩" }
  }, {
    value: "mute", label: "Mute",
    emoji: { name: "🔇" }
  }, {
    value: "full", label: "Full Video",
    emoji: { name: "♾️" }
  }]
};

const submitButton = {
  // canned reason
  type: 2,
  style: 1,
  label: "Submit Lock",
  custom_id: "lock_submit"
};

const notVIPResponse = {
  type: 4,
  data: {
    flags: 64,
    components: [],
    content: "Error looking up VIP status"
  }
};

const cannedReason = {
  // submit button
  type: 3,
  label: "Canned Lock Reason",
  custom_id: "lock_reason",
  placeholder: "Choose Canned Lock Reason",
  min_options: 0,
  options:[{
    value: "no_reason", label: "No Reason",
    emoji: { name: "❌" }
  }, {
    value: "Entire video is sponsor", label: "Entire video is sponsor",
    emoji: EMOJI_ID_MAP["sponsor"]
  }, {
    value: "Entire video is selfpromo", label: "Entire video is selfpromo",
    emoji: EMOJI_ID_MAP["selfpromo"]
  }, {
    value: "Intermission used as Highlight", label: "Intermission used as Highlight",
    emoji: EMOJI_ID_MAP["poi_highlight"]
  }, {
    value: "Preview over spoken summary", label: "Preview over spoken summary",
    emoji: EMOJI_ID_MAP["preview"]
  }, {
    value: "Disclaimer should not be marked", label: "Disclaimer should not be marked",
    emoji: EMOJI_ID_MAP["intro"]
  }]
};

const validateVIP = async (interaction) => {
  const currentDiscordUserID = interaction.member.user.id;
  const previousInteraction = interaction.message.interaction;
  const previousDiscordUserID = previousInteraction.user.id;
  const currentUserVIP = await checkVIP(interaction.member);
  return ((currentDiscordUserID === previousDiscordUserID) && currentUserVIP);
};

const resusableResponse = (embed, component) => {
  return {
    type: 7,
    data: {
      embeds: [embed],
      components: component
    }
  };
};

const categorySelect = async ({ interaction, response }) => {
  const isVIP = await validateVIP(interaction);
  if (!isVIP) return response(notVIPResponse);
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  lockOptions.categories = interaction.data.values;
  const embed = lockResponse(lockOptions);
  return response(resusableResponse(embed, actionRow(typeComponent)));
};

const typeSelect = async ({ interaction, response }) => {
  const isVIP = await validateVIP(interaction);
  if (!isVIP) return response(notVIPResponse);
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  lockOptions.actionTypes = interaction.data.values;
  const nextComponent = lockOptions.reason ? submitButton : cannedReason;
  const embed = lockResponse(lockOptions);
  return response(resusableResponse(embed, actionRow(nextComponent)));
};

const cannedReasonSelect = async ({ interaction, response }) => {
  const isVIP = await validateVIP(interaction);
  if (!isVIP) return response(notVIPResponse);
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  const lockReason = interaction.data.values[0];
  if (lockReason !== "no_reason") lockOptions.reason = lockReason;
  const embed = lockResponse(lockOptions);
  return response(resusableResponse(embed, actionRow(submitButton)));
};

const submit = async ({ interaction, response }) => {
  const isVIP = await validateVIP(interaction);
  if (!isVIP) return response(notVIPResponse);
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  const embed = lockResponse(lockOptions, false);
  await lockLog(interaction.member.user, embed);
  const result = await vip.lockCategories(lockOptions);
  if (result.ok) {
    embed.description = `Successfully locked \`${lockOptions.videoID}\``;
    embed.color = 0x00ff00;
  } else {
    embed.description = `error: ${result.statusText}`;
    embed.color = 0xff0000;
  }
  return response(resusableResponse(embed, []));
};

module.exports = {
  actionRow,
  lockResponse,
  categoryComponent,
  categorySelect,
  typeSelect,
  cannedReasonSelect,
  submit
};
