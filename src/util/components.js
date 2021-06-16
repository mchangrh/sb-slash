const SBTOOLSURL = "https://sb.ltn.fi";

const userComponents = (publicid, ephemeral) => {
  const components = [{
    type: 1,
    components: [{
      type: 2,
      label: "Open in Browser",
      style: 5,
      url: `${SBTOOLSURL}/userid/${publicid}`
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

const segmentComponents = (videoID, ephemeral) => {
  const components = [{
    type: 1,
    components: [{
      type: 2,
      label: "Open Video",
      style: 5,
      url: `${SBTOOLSURL}/video/${videoID}`
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

module.exports = {
  userComponents,
  segmentComponents
};
