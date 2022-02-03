const { vip } = require("./min-api.js");

function actionRow(component) {
  return [{
    type: 1,
    components: [component]
  }];
}

const lockResponse = (body, footer = true) => {
  const embeds = [{
    title: "Lock Video",
    url: `https://www.youtube.com/watch?v=${body.videoID}`,
    color: 0xffc83d,
    fields: [],
    footer: {}
  }];
  Object.entries(body).forEach(([key, value]) => {
    embeds[0].fields.push({
      name: key,
      value: `\`${value}\``
    });
  });
  if (footer) embeds[0].footer.text = JSON.stringify(body);
  return embeds;
};

const lockLog = (user, embeds) => {
  const username = `${user.username}#${user.discriminator}`;
  const avatar_url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
  const webhookBody = {
    username,
    avatar_url,
    embeds
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
    emoji: {
      name: "sponsor",
      id: "936878146156892240"
    }
  }, {
    value: "selfpromo", label: "Unpaid/Self Promotion",
    emoji: {
      name: "selfpromo",
      id: "936878146228207636"
    }
  }, {
    value: "interaction", label: "Interaction Reminder (Subscribe)",
    emoji: {
      name: "interaction_reminder",
      id: "936878145993322557"
    }
  }, {
    value: "intro", label: "Intermission/Intro Animation",
    emoji: {
      name: "intro",
      id: "936878146391769108"
    }
  }, {
    value: "outro", label: "Endcards/Credits (Outro)",
    emoji: {
      name: "outro",
      id: "936878146135920700"
    }
  }, {
    value: "preview", label: "Preview/Recap",
    emoji: {
      name: "preview",
      id: "936878146190471178"
    }
  }, {
    value: "music_offtopic", label: "Music: Non-Music Section",
    emoji: {
      name: "nonmusic",
      id: "936878146186252288"
    }
  }, {
    value: "poi_highlight", label: "Highlight",
    emoji: {
      name: "poi_highlight",
      id: "936878146316292106"
    }
  }, {
    value: "filler", label: "Filler Tangent",
    emoji: {
      name: "filler",
      id: "936878145812971581"
    }
  }, {
    value: "exclusive_access", label: "Exclusive Access",
    emoji: {
      name: "exclusive_access",
      id: "936878145909424179"
    }
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
    emoji: {
      name: "sponsor",
      id: "936878146156892240"
    }
  }, {
    value: "Entire video is selfpromo", label: "Entire video is selfpromo",
    emoji: {
      name: "selfpromo",
      id: "936878146228207636"
    }
  }, {
    value: "Intermission used as Highlight", label: "Intermission used as Highlight",
    emoji: {
      name: "poi_highlight",
      id: "936878146316292106"
    }
  }, {
    value: "Preview over spoken summary", label: "Preview over spoken summary",
    emoji: {
      name: "preview",
      id: "936878146190471178"
    }
  }, {
    value: "Disclaimer should not be marked", label: "Disclaimer should not be marked",
    emoji: {
      name: "intro",
      id: "936878146391769108"
    }
  }]
};

const categorySelect = ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  lockOptions.categories = interaction.data.values;
  const embeds = lockResponse(lockOptions);
  return response({
    type: 7,
    data: {
      embeds,
      components: actionRow(typeComponent)
    }
  });
};

const typeSelect = ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  lockOptions.actionType = interaction.data.values;
  const nextComponent = lockOptions.reason ? submitButton : cannedReason;
  const embeds = lockResponse(lockOptions);
  return response({
    type: 7,
    data: {
      embeds,
      components: actionRow(nextComponent)
    }
  });
};

const cannedReasonSelect = ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  const lockReason = interaction.data.values[0];
  if (lockReason !== "no_reason") lockOptions.reason = lockReason;
  const embeds = lockResponse(lockOptions);
  return response({
    type: 7,
    data: {
      embeds,
      components: actionRow(submitButton)
    }
  });
};

const submit = async ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.embeds[0].footer.text);
  const embeds = lockResponse(lockOptions, false);
  await lockLog(interaction.member.user, embeds);
  const result = await vip.lockCategories(lockOptions);
  if (result.ok) {
    embeds[0].description = `Successfully locked \`${lockOptions.videoID}\``;
    embeds[0].color = 0x00ff00;
  } else {
    embeds[0].description = `error: ${result.statusText}`;
    embeds[0].color = 0xff0000;
  }
  return response({
    type: 7,
    data: {
      embeds,
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