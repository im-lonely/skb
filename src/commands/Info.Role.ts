import Discord from "discord.js";
import Command from "../Type.Command";
import parseCase from "../utils/Parse.Case";
import parseRoles from "../utils/Parse.Roles";
import parseTrim from "../utils/Parse.Trim";

export default {
  name: "roleinfo",
  aliases: ["ri"],
  args: true,
  usage: "<role>",
  description: "Displays general role info.",
  async execute(message, args, client) {
    const role = parseRoles(args, message)[0];

    if (!role) return message.channel.send("Role not found!");

    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(role.name)
        .addField("Members", role.members.size)
        .addField("Mentionable", role.mentionable, true)
        .addField("Hoisted", role.hoist, true)
        .addField("Color", role.hexColor)
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
