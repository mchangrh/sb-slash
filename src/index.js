const { verifyKey } = require("discord-interactions");

const { commands } = require("./util/_commands.js");
const { buttons } = require("./util/_buttons.js");
const { messageCommands } = require("./util/_messagecmd.js");
const { userCommands } = require("./util/_usercmd.js");

// Util to send a JSON response
const jsonResponse = (obj) => new Response(JSON.stringify(obj), {
  headers: { "Content-Type": "application/json" }
});

const textResponse = (str) => new Response(str, {
  headers: {
    "Content-Type": "text/plain",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Expires": "0",
    "Surrogate-Control": "no-store"
  }
});

// Util to verify a Discord interaction is legitimate
const handleInteractionVerification = (request, bodyBuffer) => {
  const timestamp = request.headers.get("X-Signature-Timestamp") || "";
  const signature = request.headers.get("X-Signature-Ed25519") || "";
  return verifyKey(bodyBuffer, signature, timestamp, CLIENT_PUBLIC_KEY);
};

// Process a Discord interaction POST request
const handleInteraction = async ({ request, wait }) => {
  // Get the body as a buffer and as text
  const bodyBuffer = await request.arrayBuffer();
  const bodyText = (new TextDecoder("utf-8")).decode(bodyBuffer);

  // Verify a legitimate request
  if (!handleInteractionVerification(request, bodyBuffer))
    return new Response(null, { status: 401 });

  // Work with JSON body going forward
  const body = JSON.parse(bodyText);

  // Handle a PING
  if (body.type === 1)
    return jsonResponse({ type: 1 });
  try {
    if (body.type == 2) { // handle commands
      const commandName = body.data.name;
      if (Object.keys(userCommands).includes(commandName)) { // check in userCmd list
        const command = userCommands[commandName];
        // load and execute
        return await command.execute({ interaction: body, response: jsonResponse, wait });
      } else if (Object.keys(messageCommands).includes(commandName)) { // check in messageCmd list
        // load and execute
        const command = messageCommands[commandName];
        return await command.execute({ interaction: body, response: jsonResponse, wait });
      } else if (Object.keys(commands).includes(commandName)) { // check in commands list
        // load and execute
        const command = commands[commandName];
        return await command.execute({ interaction: body, response: jsonResponse, wait });
      } else { // command not found, 404
        return new Response(null, { status: 404 });
      }
    } else if (body.type == 3) { // handle buttons
      // Locate button data
      const buttonName = body.data.custom_id;
      if (!buttons.find((e) => e === buttonName))
        return new Response(null, { status: 404 });
      // load and execute
      const button = buttons[buttonName];
      return await button.execute({ interaction: body, response: jsonResponse, wait });
    } else { // if not ping, button or message send 501
      return new Response(null, { status: 501 });
    }
  } catch (err) {
    // Catch & log any errors
    // eslint-disable-next-line no-console
    console.log(err);

    // Send an ephemeral message to the user
    return jsonResponse({
      type: 4,
      data: {
        //content: "An unexpected error occurred when executing the command.",
        content: `error: ${err}`,
        flags: 64
      }
    });
  }
};

const redirect = (url) => new Response(null, { status: 301, headers: { "Location": url } });

// Process all requests to the worker
const handleRequest = async ({ request, wait }) => {
  const url = new URL(request.url);
  // Send interactions off to their own handler
  if (request.method === "POST" && url.pathname === "/interactions")
    return await handleInteraction({ request, wait });
  if (url.pathname === "/ping")
    return textResponse("pong");
  if (url.pathname === "/version")
    return textResponse(VERSION.substring(0,7));
  if (url.pathname === "/invite")
    return redirect(`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=applications.commands`);
  if (url.pathname === "/")
    return redirect("https://github.com/mchangrh/sb-slash#readme");
  return new Response(null, { status: 404 });
};

// Register the worker listener
addEventListener("fetch", (event) => {
  // Process the event
  return event.respondWith(handleRequest({
    request: event.request,
    wait: event.waitUntil.bind(event)
  }).catch((err) => {
    // Log & re-throw any errors
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }));
});
