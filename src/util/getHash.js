async function hashMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // bytes to hex string
  return hashHex;
}

module.exports = {
  hashMessage
};
