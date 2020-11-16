import Discord from "discord.js";
import { token, prefix } from "./config.json";

const client = new Discord.Client();

client.on("ready", () => {
  console.log("Ready!");
  client.user?.setActivity({ type: "WATCHING", name: " over the server" });
});

client.on("message", async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
});

client.login(token);
