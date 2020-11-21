import Command from "../Type.Command";
import Discord from "discord.js";
import parseMembers from "../utils/Parse.Members";
import failsRef from "..";

export default {
  name: "kick",
  aliases: ["boot"],
  args: true,
  usage: "<members> [reason]",
  description: "Kick users for the specified reason. Default reason is `None`.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("KICK_MEMBERS")) return;

    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const reason = args.slice(members.length).join(" ") || "None";

    let couldntKick: string[] = [];

    members.forEach((member) => {
      member?.kick(reason).catch(() => {
        failsRef.current++;
        couldntKick.push(member.user.tag);
      });
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("👢 K I C K E D 👢")
      .setFooter(message.author.tag)
      .setDescription(`Kicked ${members.length} users for \`${reason}\``)
      .addField(
        "Kicked users",
        members.map((member) => member?.user.tag).join("\n")
      )
      .setColor("RANDOM");

    if (couldntKick.length)
      embed.addField("Failed to kick", couldntKick.join("\n"));

    return message.channel.send(embed);
  },
} as Command;
