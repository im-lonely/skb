import Command from "../Type.Command";
import Discord from "discord.js";
import parseMembers from "../utils/Parse.Members";
import failsRef from "..";

export default {
  name: "tempban",
  aliases: ["temphammer"],
  args: true,
  usage: "<members> <days> [reason]",
  description:
    "Ban users for the specified reason, for a set amount of days. Default reason is `None`.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("BAN_MEMBERS")) return;

    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const days = parseInt(args.slice(1)[0]);

    const reason = args.slice(members.length).join(" ") || "None";

    let couldntTempban: string[] = [];

    members.forEach((member) => {
      member
        ?.ban({
          reason,
          days,
        })
        .catch(() => {
          failsRef.current++;
          couldntTempban.push(member.user.tag);
        });
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("⌛ T E M P B A N N E D ⌛")
      .setFooter(message.author.tag)
      .setDescription(
        `Tempbanned ${members.length} ${
          members.length === 1 ? "user" : "users"
        } for \`${reason}\``
      )
      .addField(
        "Tempbanned users",
        members.map((member) => member?.user.tag).join("\n")
      )
      .setColor("RANDOM");

    if (couldntTempban.length)
      embed.addField("Failed to tempban", couldntTempban.join("\n"));

    return message.channel.send(embed);
  },
} as Command;
