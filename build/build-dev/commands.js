const fs = require("fs");
const path = require("path");
const { DiscordInteractions } = require("slash-commands");
const equal = require("deep-equal");
const guildID = process.env.GUILD_ID;

const consistentCommandOption = (obj) => ({
  type: obj.type,
  name: obj.name,
  description: obj.description,
  default: !!obj.default,
  required: !!obj.required,
  choices: obj.choices || [],
  options: obj.options || []
});

const updatedCommandProps = (oldCmd, newCmd) => ({
  name: oldCmd.name !== newCmd.name,
  description: oldCmd.description !== newCmd.description,
  options: !equal(
    oldCmd.options && oldCmd.options.map(consistentCommandOption),
    newCmd.options && newCmd.options.map(consistentCommandOption)
  )
});

const updatedCommandPatch = (cmd, diff) => Object.keys(cmd)
  .filter((key) => key in diff && diff[key])
  .reduce((obj, key) => {
    obj[key] = cmd[key];
    return obj;
  }, {});

module.exports.getCommands = () => {
  const commands = [];

  // Get all files in the commands directory
  const commandDirectory = path.join(__dirname, "..", "..", "src", "commands");
  const commandFiles = fs.readdirSync(commandDirectory);
  const messageDirectory = path.join(__dirname, "..", "..", "src", "msgcommands");
  const messageFiles = fs.readdirSync(messageDirectory);
  const userDirectory = path.join(__dirname, "..", "..", "src", "usercommands");
  const userFiles = fs.readdirSync(userDirectory);

  // Work through each file
  for (const commandFile of commandFiles) {
    // Load the file in if JS
    if (!commandFile.endsWith(".js")) continue;
    const commandData = require(path.join(commandDirectory, commandFile));

    // Validate it is a command
    if (!("name" in commandData)) continue;
    if (!("execute" in commandData)) continue;

    // Remove execute for storing and add file
    delete commandData.execute;
    commandData.file = commandFile;

    // Store
    commands.push(commandData);
  }
  // load msgcommands
  for (const messageCommand of messageFiles) {
    // Load the file in if JS
    if (!messageCommand.endsWith(".js")) continue;
    const messageData = require(path.join(messageDirectory, messageCommand));

    // Validate it is a command
    if (!("name" in messageData)) continue;
    if (!("execute" in messageData)) continue;

    // Remove execute for storing and add file
    delete messageData.execute;
    messageData.file = messageCommand;

    // Store
    commands.push(messageData);
  }
  // load usercommands
  for (const userCommand of userFiles) {
    // Load the file in if JS
    if (!userCommand.endsWith(".js")) continue;
    const userData = require(path.join(userDirectory, userCommand));

    // Validate it is a command
    if (!("name" in userData)) continue;
    if (!("execute" in userData)) continue;

    // Remove execute for storing and add file
    delete userData.execute;
    userData.file = userCommand;

    // Store
    commands.push(userData);
  }
  return commands;
};

module.exports.registerCommands = async (commands) => {
  // Define the builder
  const interaction = new DiscordInteractions({
    applicationId: process.env.CLIENT_ID,
    authToken: process.env.BOT_TOKEN,
    publicKey: process.env.CLIENT_PUBLIC_KEY
  });

  // Define the commands and get what Discord currently has
  const discordCommands = await interaction.getApplicationCommands(guildID);
  // eslint-disable-next-line no-console
  console.log(discordCommands);

  // Remove old commands
  for (const command of discordCommands) {
    if (commands.find((cmd) => cmd.name === command.name)) continue;
    await interaction.deleteApplicationCommand(command.id, guildID);
  }

  // Register or update the commands with Discord
  const commandData = [];
  for (const command of commands) {
    // This command already exists in Discord
    const discordCommand = discordCommands.find((cmd) => cmd.name === command.name);
    if (discordCommand) {
      // Get which props have changed
      const cmdDiff = updatedCommandProps(discordCommand, command);

      // Only patch if a prop has changed
      if (Object.values(cmdDiff).includes(true)) {
        // Get the props to patch and do the update
        const cmdPatch = updatedCommandPatch(command, cmdDiff);
        const data = await interaction.editApplicationCommand(discordCommand.id, cmdPatch, guildID);
        commandData.push({ ...command, ...data });
        continue;
      }

      // Store the existing command, nothing changed
      commandData.push({ ...discordCommand, ...command });
      continue;
    }

    // Register the new command
    const data = await interaction.createApplicationCommand(command, guildID);
    commandData.push({ ...command, ...data });
  }

  // Done
  return commandData;
};
