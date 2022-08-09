const SBBROWSERURL = "https://sb.ltn.fi";

exports.userComponents = (publicid, hideLookupButton) => {
  const components = [{
    type: 1,
    components: [{
      type: 2,
      label: "Open in Browser",
      style: 5,
      url: `${SBBROWSERURL}/userid/${publicid}/`
    }]
  }];
  const lookupButton = {
    type: 2,
    label: "Lookup Last Submission",
    style: 1,
    custom_id: "lookupsegment"
  };
  if (!hideLookupButton) components[0].components.push(lookupButton);
  return components;
};

exports.segmentComponents = (videoID, ephemeral) => {
  const components = [{
    type: 1,
    components: [{
      type: 2,
      label: "Open Video",
      style: 5,
      url: `${SBBROWSERURL}/video/${videoID}/`
    }]
  }];
  const lookupButton = {
    type: 2,
    label: "Lookup User",
    style: 1,
    custom_id: "lookupuser"
  };
  if (!ephemeral) components[0].components.push(lookupButton);
  return components;
};

exports.searchSegmentsComponents = (result) => {
  const { page, segmentCount } = result;
  const lastPage = Math.ceil(segmentCount/10)-1;
  if (lastPage == 0) return [];
  return [{
    type: 1,
    components: [{
      type: 2,
      label: "Previous page",
      style: 2,
      custom_id: "searchsegments_prev",
      emoji: {
        id: null,
        name: "◀️"
      },
      disabled: page <= 0
    }, {
      type: 2,
      label: "Next page",
      style: 2,
      custom_id: "searchsegments_next",
      emoji: {
        id: null,
        name: "▶️"
      },
      disabled: page >= lastPage
    }]
  }];
};

exports.automodComponents = (videoID, submitArr) => {
  const submitUrl = encodeURI(`https://www.youtube.com/watch?v=${videoID}#segments=${JSON.stringify(submitArr)}`);
  return [{
    type: 1,
    components: [{
      type: 2,
      label: "Submit All",
      style: 5,
      url: submitUrl
    }, {
      type: 2,
      label: "Done",
      style: 3,
      custom_id: "automod_done",
      emoji: { name: "✅" }
    }, {
      type: 2,
      label: "Skip",
      style: 2,
      custom_id: "automod_skip",
      emoji: { name: "♻️" }
    }, {
      type: 2,
      label: "Reject",
      style: 4,
      custom_id: "automod_reject",
      emoji: { name: "👎" }
    }]
  }];
};

exports.classifyComponents = (locked) => {
  const row1 = [{
    type: 2,
    label: "Done",
    style: 3,
    custom_id: "classify_done",
    emoji: { name: "✅" }
  }, {
    type: 2,
    label: "Skip",
    style: 2,
    custom_id: "classify_skip",
    emoji: { name: "♻️" }
  }, {
    type: 2,
    label: "Reject",
    style: 4,
    custom_id: "classify_reject",
    emoji: { name: "👎" }
  }];
  if (!locked) {
    row1.unshift({
      type: 2,
      label: "Vote with sb-slash",
      style: 1,
      custom_id: "classify_vip",
      emoji: { name: "👑" }
    });
  }
  const row2 = [{
    type: 2,
    label: "Ignore",
    style: 4,
    custom_id: "classify_ignore",
    emoji: { name: "🗑️" }
  }, {
    type: 2,
    label: "Flag",
    style: 2,
    custom_id: "classify_flag",
    emoji: { name: "🚩" }
  }];
  return [{
    type: 1,
    components: row1
  }, {
    type: 1,
    components: row2
  }];
};
