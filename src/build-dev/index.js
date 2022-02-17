const path = require("path");
const fs = require("fs").promises;
require("dotenv").config();
// global override for scheduler
global.scheduler = {};
global.scheduler.wait = async () => await true;
const { getCommands, registerCommands } = require("./commands");

const setup = async function() {
  // Get all our local commands
  const commands = getCommands();

  // Register the commands with Discord
  const discordCommands = await registerCommands(commands);
  // Export the Discord commands as JSON
  // Mapped to be keyed by their API ID
  const discordCommandsObj = discordCommands.reduce((obj, cmd) => {
    obj[cmd.id] = cmd;
    return obj;
  }, {});
  await fs.writeFile(path.join(__dirname, "data", "commands.json"), JSON.stringify(discordCommandsObj, null, 2));

  // Done
  // eslint-disable-next-line no-console
  console.log("Commands data ready to go!");
};
setup();