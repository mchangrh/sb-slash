const strictRegex = new RegExp(/^[a-f0-9]{64}$/);
const linkRegex = new RegExp(/(?:^|^https:\/\/sb.ltn.fi\/userid\/)([a-f0-9]{64})(?:$|\/$)/);
const strictCheck = (str) => strictRegex.test(str);
const linkCheck = (str) => linkRegex.test(str);
const linkExtract = (str) => str.match(linkRegex)[1];

module.exports = {
  strictCheck,
  linkCheck,
  linkExtract
};