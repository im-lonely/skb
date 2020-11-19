import Discord from "discord.js";
import { Command } from "../types";
import parseList from "../utils/parseList";

export default {
  name: "info",
  aliases: [],
  args: false,
  usage: "[field]",
  description: "Displays general information about the bot.",
  execute(message, args, client) {
    const fields = ["ping"];

    if (!args.length)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(`Info for ${client.user?.tag}`)
          .setFooter(client.user?.tag)
          .setColor("RANDOM")
          .setTimestamp(message.createdAt)
          .setDescription(
            `Available fields are ${parseList(
              fields.map((f) => "`" + f + "`")
            )}.`
          )
          .addField("Ping", "Client ping:\nLatency:", true)
          .addField(
            "Info",
            `${client.ws.ping.toFixed(2)}\n${
              Date.now() - message.createdTimestamp
            }}`
          )
      );
  },
} as Command;
