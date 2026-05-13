const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
              GatewayIntentBits.MessageContent
                ]
                });

                client.on("ready", () => {
                  console.log("Bot online 😄");
                  });

                  client.on("messageCreate", (message) => {
                    if (message.author.bot) return;

                      if (message.content.toLowerCase() === "hi") {
                          message.reply("Hello bhai 😭");
                            }
                            });

                            client.login("TOKEN");