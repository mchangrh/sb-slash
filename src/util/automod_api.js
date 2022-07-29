const ML_URL = "https://ml.sb.mchang.xyz";

const getUrl = (path, endpoint, options) => {
  const url = new URL(`${ML_URL}/${path}/${endpoint}?auth=${ML_AUTH}`);
  for (const [key, value] of Object.entries(options)) {
    if (!value) continue;
    url.searchParams.append(key, value);
  }
  return fetch(url);
};

module.exports = {
  ml: (endpoint, options={}) => getUrl("ml", endpoint, options),
  classify: (endpoint, options={}) => getUrl("classify", endpoint, options)
};
