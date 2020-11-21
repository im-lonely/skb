import Command from "../Type.Command";
import { prefix } from "../config.json";
import Discord from "discord.js";
import failsRef from "..";

export default {
  name: "help",
  aliases: ["commands"],
  args: false,
  usage: "[command]",
  description:
    "Displays all commands and info on a specific command if specified.",
  async execute(message, args, client) {
    const { commands } = client;

    if (!args.length) {
      return message.author
        .send(
          new Discord.MessageEmbed()
            .setTitle("Help")
            .setColor("RANDOM")
            .setDescription(
              `Use \`${prefix}help <command>\` for info on a specific command.`
            )
            .setFooter(client.user?.tag)
            .setTimestamp(message.createdAt)
            .addField("Commands", commands.map((cmd) => cmd.name).join("\n"))
        )
        .then(() => {
          message.react("✅");
        })
        .catch(() => {
          failsRef.current++;
          ("Couldn't send the message. Do you have DMs disabled?");
        });
    }

    const name = args[0].toLowerCase();
    const command: Command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command)
      return message.channel.send(`Couldn't find the command \`${name}\`!`);

    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(`Info for ${command.name}`)
        .setDescription(
          `Arguments wrapped in \`<>\` are required and arguments wrapped in \`[]\` are optional.`
        )
        .addField("Aliases", command.aliases.join("\n"))
        .addField("Description", command.description)
        .addField("Usage", `\`${prefix}${command.name} ${command.usage}\``)
        .setColor("RANDOM")
        .setFooter(client.user?.tag)
        .setTimestamp(message.createdAt)
    );
  },
} as Command;
