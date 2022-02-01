const { axiosResponse } = require("./formatResponse.js");
const { vip } = require("./min-api.js");

function actionRow(component) {
  return [{
    type: 1,
    components: [component]
  }];
}
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

const cannedReason = {
  // canned reason
  type: 3,
  custom_id: "lock_reason_select",
  placeholder: "Choose Skip Type",
  min_values: 0,
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
}

const submitButton = {
  // submit button
  type: 3,
  label: "Canned Lock Reason",
  custom_id: "lock_reason",
  options:[{
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
  const lockOptions = JSON.parse(interaction.message.content);
  lockOptions.categories = interaction.data.values;
  return response({
    type: 7,
    data: {
      content: JSON.stringify(lockOptions),
      components: actionRow(typeComponent)
    }
  });
};

const typeSelect = ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.content);
  lockOptions.actionType = interaction.data.values;
  const nextComponent = lockOptions.reason ? cannedReason : submitButton;
  return response({
    type: 7,
    data: {
      content: JSON.stringify(lockOptions),
      components: actionRow(nextComponent)
    }
  });
};

const cannedReasonSelect = ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.content);
  lockOptions.reason = interaction.data.values;
  return response({
    type: 7,
    data: {
      content: JSON.stringify(lockOptions),
      components: actionRow(submitButton)
    }
  });
};

const submit = async ({ interaction, response }) => {
  const lockOptions = JSON.parse(interaction.message.content);
  //const result = vip.lockCategories(lockOptions);
  //const resResponse = await axiosResponse(result);
  const resResponse = `test response: ${JSON.stringify(lockOptions)}`;
  return response({
    type: 7,
    data: {
      content: resResponse
    }
  });
};

module.exports = {
  actionRow,
  categoryComponent,
  categorySelect,
  typeSelect,
  cannedReasonSelect,
  submit
};