import Command from "../Type.Command";
import Discord from "discord.js";
import parseMembers from "../utils/Parse.Members";
import failsRef from "..";

export default {
  name: "unban",
  aliases: ["unhammer", "revoke"],
  args: true,
  usage: "<members> <reason>",
  description: "Unban users for the specified reason. The reason is required.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("BAN_MEMBERS")) return;

    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const reason = args.slice(members.length).join(" ");

    if (!reason) return message.channel.send("You must specify a reason!");

    let couldntUnban: string[] = [];

    members.forEach((member) => {
      message.guild?.members.unban(member?.id!, reason).catch(() => {
        failsRef.current++;
        couldntUnban.push(member?.user.tag!);
      });
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("⚒️ U N B A N N E D ⚒️")
      .setFooter(message.author.tag)
      .setDescription(
        `Unbanned ${members.length} ${
          members.length === 1 ? "user" : "users"
        } for \`${reason}\``
      )
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
