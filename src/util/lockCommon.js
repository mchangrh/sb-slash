const { vip } = require("./min-api.js");
const { EMOJI_ID_MAP } = require("sb-category-type");

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
const categoryComponent = {
  // category select
  type: 3,
  custom_id: "lock_category_select",
  placeholder: "Choose Categories",
  min_values: 1,
  max_values: 10,
  options:[{
    value: "sponsor", label: "Sponsor",
    emoji: EMOJI_ID_MAP["sponsor"]
  }, {
    value: "selfpromo", label: "Unpaid/Self Promotion",
    emoji: EMOJI_ID_MAP["selfpromo"]
  }, {
    value: "interaction", label: "Interaction Reminder (Subscribe)",
    emoji: EMOJI_ID_MAP["interaction_reminder"]
  }, {
    value: "intro", label: "Intermission/Intro Animation",
    emoji: EMOJI_ID_MAP["intro"]
  }, {
    value: "outro", label: "Endcards/Credits (Outro)",
    emoji: EMOJI_ID_MAP["outro"]
  }, {
    value: "preview", label: "Preview/Recap",
    emoji: EMOJI_ID_MAP["preview"]
  }, {
    value: "music_offtopic", label: "Music: Non-Music Section",
    emoji: EMOJI_ID_MAP["nonmusic"]
  }, {
    value: "poi_highlight", label: "Highlight",
    emoji: EMOJI_ID_MAP["highlight"]
  }, {
    value: "filler", label: "Filler Tangent/ Jokes",
    emoji: EMOJI_ID_MAP["filler"]
  }, {
    value: "exclusive_access", label: "Exclusive Access",
    emoji: EMOJI_ID_MAP["exclusive_access"]
  }]
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
    emoji: EMOJI_ID_MAP["highlight"]
  }, {
    value: "Preview over spoken summary", label: "Preview over spoken summary",
    emoji: EMOJI_ID_MAP["preview"]
  }, {
    value: "Disclaimer should not be marked", label: "Disclaimer should not be marked",
    emoji: EMOJI_ID_MAP["intro"]
  }]
};

const categorySelect = ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  lockOptions.categories = interaction.data.values;
  const embed = lockResponse(lockOptions);
  return response({
    type: 7,
    data: {
      embeds: [embed],
      components: actionRow(typeComponent)
    }
  });
};

const typeSelect = ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  lockOptions.actionType = interaction.data.values;
  const nextComponent = lockOptions.reason ? submitButton : cannedReason;
  const embed = lockResponse(lockOptions);
  return response({
    type: 7,
    data: {
      embeds: [embed],
      components: actionRow(nextComponent)
    }
  });
};

const cannedReasonSelect = ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  const lockReason = interaction.data.values[0];
  if (lockReason !== "no_reason") lockOptions.reason = lockReason;
  const embed = lockResponse(lockOptions);
  return response({
    type: 7,
    data: {
      embeds: [embed],
      components: actionRow(submitButton)
    }
  });
};

const submit = async ({ interaction, response }) => {
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
  return response({
    type: 7,
    data: {
      embeds: [embed],
      components: []
    }
  });
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