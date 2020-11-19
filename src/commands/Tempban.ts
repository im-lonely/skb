import { Command } from "../types";
import Discord from "discord.js";
import parseMembers from "../utils/parseMembers";

export default {
  name: "tempban",
  aliases: ["temphammer"],
  args: true,
  usage: "<members> <days> [reason]",
  description:
    "Ban users for the specified reason, for a set amount of days. Default reason is `None`.",
  execute(message, args, client) {
    if (!message.member?.hasPermission("BAN_MEMBERS")) return;

    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const days = parseInt(args.slice(1)[0]);

    const reason = args.slice(members.length).join(" ") || "None";

    let tempbannedUsers = 0;
    let couldntTempban: string[] = [];

    members.forEach((member) => {
      member
        ?.ban({
          reason,
          days,
        })
        .then(() => {
          tempbannedUsers++;
        })
        .catch(() => {
          couldntTempban.push(member.user.tag);
        });
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("⌛ T E M P B A N N E D ⌛")
      .setFooter(message.author.tag)
      .setDescription(`Tempbanned ${tempbannedUsers} users for \`${reason}\``)
      .addField(
        "Tempbanned users",
        members.map((member) => member?.user.tag).join("\n")
      )
      .setColor("RANDOM");

    if (couldntTempban.length)
      embed.addField("Failed to tempban", couldntTempban.join("\n"));

    message.channel.send(embed);
  },
} as Command;
