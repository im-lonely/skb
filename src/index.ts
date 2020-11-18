import fs from "fs";
import Discord from "discord.js";
import { token, prefix } from "./config.json";
import db from "./db.json";
import { Command } from "./types";

let dbRef = db;

const client = new Discord.Client();
client.commands = new Discord.Collection<string, Command>();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log("Ready!");
  client.user?.setActivity({ type: "WATCHING", name: " over the server" });
});

client.on("message", async (message) => {
  if (message.guild) {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()!.toLowerCase();

    if (!commandName) return;

    if (!client.commands.has(commandName)) return;

    const command: Command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (command.args && !args.length) {
      return message.channel.send(
        `Usage of \`${command.name}\` would be \`${command.usage}\``
      );
    }

    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply(
        "Something went wrong! Contact `[Cursors]#9257` for troubleshooting!"
      );
    }
  } else {
    // client.guilds.cache
    //   .get("773486815457574913")
    //   ?.channels.create(message.author.tag, {
    //     parent: "777930243049783317",
    //     topic: `${message.author.id}`,
    //     type: "text",
    //   })
    //   .then((channel) => {
    //     channel.send(
    //       new Discord.MessageEmbed()
    //         .setDescription(message.content)
    //         .setFooter(message.author.tag)
    //         .setTimestamp(message.createdTimestamp)
    //     );
    //   });
    // dbRef.threads++;
    // fs.writeFileSync(__dirname + "/db.json", JSON.stringify(dbRef));
  }
});

client.login(token);
