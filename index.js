const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

  // Ignore bots
  if (message.author.bot) return;

  // Reply only if bot mentioned
  if (!message.mentions.has(client.user)) return;

  // Remove mention from message
  const userMessage = message.content
    .replace(/<@!?(\d+)>/, "")
    .trim();

  if (!userMessage) {
    return message.reply("Kuch toh bol 😭");
  }

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a chill Discord bot named X.Parallel World. Reply only in natural Hinglish. Never use Chinese or other languages. Keep replies short, human-like, funny, emotional, and Gen-Z."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    const botReply =
      data.choices?.[0]?.message?.content ||
      "Dimag hang ho gaya 😭";

    message.reply(botReply);

  } catch (err) {
    console.log(err);
    message.reply("Server so gaya 😭");
  }

});

client.login(process.env.DISCORD_BOT_TOKEN);
