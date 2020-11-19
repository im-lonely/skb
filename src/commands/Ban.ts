import { Command } from "../types";
import Discord from "discord.js";
import parseMembers from "../parseMembers";

export default {
  name: "ban",
  aliases: ["hammer"],
  args: true,
  usage: "<members> [reason]",
  description: "Ban users for the specified reason. Default reason is `None`.",
  execute(message, args, client) {
    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const reason = args.slice(members.length).join(" ") || "None";

    let bannedUsers = 0;
    let couldntBan: string[] = [];

    members.forEach((member) => {
      member
        ?.ban({
          reason,
        })
        .then(() => {
          bannedUsers++;
        })
        .catch(() => {
          couldntBan.push(member.user.tag);
        });
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("🔨 B A N N E D 🔨")
      .setFooter(message.author.tag)
      .setDescription(`Banned ${bannedUsers} users for \`${reason}\``)
      .addField(
        "Banned users",
        members.map((member) => member?.user.tag).join("\n")
      )
      .setColor("RANDOM");

    if (couldntBan.length)
      embed.addField("Failed to ban", couldntBan.join("\n"));

    message.channel.send(embed);
  },
} as Command;
