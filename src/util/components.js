const SBTOOLSURL = "https://sb.ltn.fi";

exports.userComponents = (publicid, ephemeral) => {
  const components = [{
    type: 1,
    components: [{
      type: 2,
      label: "Open in Browser",
      style: 5,
      url: `${SBTOOLSURL}/userid/${publicid}/`
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
      url: `${SBTOOLSURL}/video/${videoID}/`
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
  const { page, segmentCount } = JSON.parse(result);
  const lastPage = Math.ceil(segmentCount/10)-1;
  return [{
    type: 1,
    components: [
      {
        type: 2,
        label: "Previous page",
        style: 2,
        custom_id: "searchsegments_prev",
        emoji: {
          id: null,
          name: "◀️"
        },
        disabled: page <= 0
      },
      {
        type: 2,
        label: "Next page",
        style: 2,
        custom_id: "searchsegments_next",
        emoji: {
          id: null,
          name: "▶️"
        },
        disabled: page >= lastPage
      }
    ]
  }];
};
