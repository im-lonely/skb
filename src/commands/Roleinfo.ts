import Discord from "discord.js";
import Command from "../Command";
import parseCase from "../utils/parseCase";
import parseRoles from "../utils/parseRoles";
import parseTrim from "../utils/parseTrim";

export default {
  name: "roleinfo",
  aliases: ["ri"],
  args: true,
  usage: "<role>",
  description: "Displays general role info.",
  execute(message, args, client) {
    const role = parseRoles(args, message)[0];
    if (!role) return message.channel.send("Role not found!");
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(role.name)
        .setDescription(
          parseTrim(role.members.map((m) => m.user.username).join("\n"), 2048)
        )
        .addField("Mentionable", role.mentionable, true)
        .addField("Hoisted", role.hoist, true)
        .addField("Color", role.color)
        .addField("Id", role.id, true)
        .addField("Role created", role.createdAt, true)
        .addField("Permissions Integer", role.permissions.bitfield)
        .addField(
          "Permissions",
          parseTrim(
            role.permissions
              .toArray()
              .map((p) => parseCase(p))
              .join("\n"),
            1024
          )
        )
        .setColor(role.color)
        .setFooter(message.author)
        .setTimestamp(message.createdAt)
    );
  },
} as Command;
