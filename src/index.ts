import fs from "fs";
import path from "path";
import Discord from "discord.js";
import { token, prefix } from "./config.json";
import Command from "./Command";

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

client.on("error", (err: any) => {
  console.error(err);
  process.exit(0);
});

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

  //@ts-ignore – parentID exists
  if (message.guild && message.channel.parentID !== "777930243049783317") {
    if (!message.content.startsWith(prefix)) return;

    if (capsPercent(message.content) > 0.9)
      message.delete({ reason: "Too many caps" });

    if (message.content.includes("discord.gg/" || "discordapp.com/invite/"))
      message.delete({ reason: "Invite links are not allowed" });

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
  } else if (message.guild) {
    if (message.content.startsWith(`${prefix}close`)) {
      client.users.cache
        //@ts-ignore – this is a text channel
        .get(message.channel.topic)
        ?.send(
          new Discord.MessageEmbed()
            .setDescription(`Thread was closed by ${message.author.tag}`)
            .setFooter(message.author.tag)
            .setTimestamp(message.createdAt)
            .setColor("RANDOM")
        )
        .catch(() => {
          failsRef.current++;
        });
      message.channel.delete().catch(() => {
        failsRef.current++;
      });
    }

    client.users.cache
      //@ts-ignore – this is a text channel
      .get(message.channel.topic)
      ?.send(
        new Discord.MessageEmbed()
          .setDescription(message.content)
          .setFooter(message.author.tag)
          .setTimestamp(message.createdAt)
          .setColor("RANDOM")
      )
      .then(() => {
        message.channel.send("Successfully sent!");
      })
      .catch(() => {
        failsRef.current++;
        message.channel.send("mail fail :(");
      });
  } else {
    if (
      !client.guilds.cache
        .get("773486815457574913")
        ?.channels.cache.filter((channel) => channel.type === "text")
        //@ts-ignore – all channels left are text channels
        .find((channel) => channel.topic === message.author.id)
    ) {
      //TODO: Ping the modmail role

      client.guilds.cache
        .get("773486815457574913")
        ?.channels.create(message.author.tag, {
          parent: "777930243049783317",
          topic: message.author.id,
          type: "text",
        })
        .then((channel) => {
          channel.send(
            new Discord.MessageEmbed()
              .setDescription(message.content)
              .setFooter(message.author.tag)
              .setTimestamp(message.createdAt)
              .setColor("RANDOM")
          );
        })
        .then(() => {
          message.channel.send("Successfully sent!");
        })
        .catch(() => {
          failsRef.current++;
          message.channel.send("mail fail :(");
        });
    } else {
      client.guilds.cache
        .get("773486815457574913")!
        ?.channels.cache.filter((channel) => channel.type === "text")!
        //@ts-ignore – all channels left are text channels
        .find((channel) => channel.topic === message.author.id)!
        .send(
          //@ts-ignore – This is a text channel
          new Discord.MessageEmbed()
            .setDescription(message.content)
            .setFooter(message.author.tag)
            .setTimestamp(message.createdAt)
            .setColor("RANDOM")
        )
        //@ts-ignore – TextChannel#send is async
        .then(() => {
          message.channel.send("Successfully sent!");
        })
        .catch(() => {
          failsRef.current++;
          message.channel.send("mail fail :(");
        });
    }
  }
});

client.login(token);

export default failsRef;
