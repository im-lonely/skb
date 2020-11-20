import Command from "../Command";
import Discord from "discord.js";
import parseMembers from "../utils/parseMembers";
import failsRef from "..";

export default {
  name: "unban",
  aliases: ["unhammer"],
  args: true,
  usage: "<members> <reason>",
  description: "Unban users for the specified reason. The reason is required.",
  execute(message, args, client) {
    if (!message.member?.hasPermission("BAN_MEMBERS")) return;

    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const reason = args.slice(members.length).join(" ");

    if (!reason) return message.channel.send("You must specify a reason!");

    let unbannedUsers = 0;
    let couldntUnban: string[] = [];

    members.forEach((member) => {
      message.guild?.members
        .unban(member?.id!, reason)
        .then(() => {
          unbannedUsers++;
        })
        .catch(() => {
          failsRef.current++;
          couldntUnban.push(member?.user.tag!);
        });
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("⚒️ U N B A N N E D ⚒️")
      .setFooter(message.author.tag)
      .setDescription(`Unbanned ${unbannedUsers} users for \`${reason}\``)
      .addField(
        "Unbanned users",
        members.map((member) => member?.user.tag).join("\n")
      )
      .setColor("RANDOM");

    if (couldntUnban.length)
      embed.addField("Failed to unban", couldntUnban.join("\n"));

    return message.channel.send(embed);
  },
} as Command;
