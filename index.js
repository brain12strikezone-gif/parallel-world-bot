const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Duplicate message blocker
const processedMessages = new Set();

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

  // Ignore bots
  if (message.author.bot) return;

  // Ignore duplicate events
  if (processedMessages.has(message.id)) return;
  processedMessages.add(message.id);

  // Auto remove after 5 sec
  setTimeout(() => {
    processedMessages.delete(message.id);
  }, 5000);

  // Reply only if bot mentioned
  if (!message.mentions.has(client.user)) return;

  // Remove mention
  const userMessage = message.content
    .replace(/<@!?(\d+)>/, "")
    .trim();

  if (!userMessage) {
    return message.reply("Kuch toh bol bhai 😭");
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
                "You are X.Parallel World, a funny chill Discord bot. Reply ONLY in Hinglish. Never use English-only or Chinese. Keep replies short, human, funny, Gen-Z, emotional."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 80
        })
      }
    );

    const data = await response.json();

    const botReply =
      data.choices?.[0]?.message?.content ||
      "Dimag short circuit ho gaya 😭";

    await message.reply(botReply);

  } catch (err) {
    console.log(err);
    message.reply("Server so gaya bhai 😭");
  }

});

client.login(process.env.MTUwNDE5NDU3NDgzNzYxMjYxNA.GXKVi4.D4CNECwCPWJ2pjxAsJRNeBf7mvq9KcK3HZnXg4);
