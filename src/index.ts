import fs from "fs";
import path from "path";
import Discord from "discord.js";
import { token, prohibitedWords, prefix } from "./config.json";
import Command from "./Type.Command";

const failsRef = {
  current: 0,
};

const activities: Discord.ActivityOptions[] = [
  { type: "WATCHING", name: " over the server" },
  {
    type: "CUSTOM_STATUS",
    name: `My prefix is ${prefix}`,
  },
  {
    type: "PLAYING",
    name: " some games",
  },
];

let activity = 0;

const client = new Discord.Client();
client.commands = new Discord.Collection<string, Command>();

const commandFiles = fs
  .readdirSync(path.join(__dirname, "/commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log("Ready!");
  client.user?.setActivity(activities[activity]);

  setInterval(() => {
    client.user?.setActivity(
      activities[++activity > activities.length - 1 ? (activity = 0) : activity]
    );
  }, 60000);
});

const capsPercent = (string: string) =>
  string.split("").filter((char) => char === char.toUpperCase()).length /
  string.length;

client.on("message", async (message) => {
  if (message.author.bot) return;

  prohibitedWords.forEach((word) => {
    if (message.content.includes(word))
      message.delete({ reason: "Using slurs" });
  });

  //@ts-ignore – parentID exists
  if (message.guild && message.channel.parentID !== "777930243049783317") {
    if (
      /(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discordapp.com\/invite)\/[^\s/]+?(?=\b)/.test(
        message.content
      )
    )
      message.delete({ reason: "Invite links are not allowed" });

    if (capsPercent(message.content) > 0.9)
      message.delete({ reason: "Too many caps" });

    if (!message.content.startsWith(prefix)) return;

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
    } catch (err) {
      console.error(err);
      message.reply(
        "Something went wrong! Contact `[Cursors]#9257` for troubleshooting!"
      );
    }
  }
});

client.login(token);

export default failsRef;
