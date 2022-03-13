const SBBROWSERURL = "https://sb.ltn.fi";

exports.userComponents = (publicid, ephemeral) => {
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
  if (!ephemeral) components[0].components.push(lookupButton);
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
      style: 1,
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