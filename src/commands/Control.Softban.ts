import Command from "../Type.Command";
import Discord from "discord.js";
import parseMembers from "../utils/Parse.Members";
import failsRef from "..";

export default {
  name: "softban",
  aliases: ["softhammer"],
  args: true,
  usage: "<members> [reason]",
  description:
    "Softban users for the specified reason. Default reason is `None`.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("KICK_MEMBERS")) return;

    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const reason = args.slice(members.length).join(" ") || "None";

    let softbannedUsers = 0;
    let couldntSoftban: string[] = [];

    members.forEach((member) => {
      member
        ?.ban({
          reason,
        })
        .then(() => {
          message.guild?.members.unban(member.id);
          softbannedUsers++;
        })
        .catch(() => {
          failsRef.current++;
          couldntSoftban.push(member.user.tag);
        });
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("🍌 S O F T B A N N E D 🍌")
      .setFooter(message.author.tag)
      .setDescription(`Softbanned ${softbannedUsers} users for \`${reason}\``)
      .addField(
        "Softbanned users",
        members.map((member) => member?.user.tag).join("\n")
      )
      .setColor("RANDOM");

    if (couldntSoftban.length)
      embed.addField("Failed to softban", couldntSoftban.join("\n"));

    return message.channel.send(embed);
  },
} as Command;
