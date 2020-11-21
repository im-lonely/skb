import Command from "../Type.Command";
import Discord from "discord.js";
import parseMembers from "../utils/Parse.Members";
import failsRef from "..";

export default {
  name: "unmute",
  aliases: ["unshut"],
  args: true,
  usage: "<members> [reason]",
  description:
    "Unmute users for the specified reason. Default reason is `None`.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("KICK_MEMBERS")) return;

    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const reason = args.slice(members.length).join(" ") || "None";

    let unmutedUsers = 0;
    let couldntUnmute: string[] = [];

    if (message.guild?.roles.cache.find((r) => r.name === "Muted"))
      members.forEach((member) => {
        member?.roles
          .remove(message.guild?.roles.cache.find((r) => r.name === "Muted")!)
          .then(() => {
            unmutedUsers++;
          })
          .catch(() => {
            failsRef.current++;
            couldntUnmute.push(member.user.tag);
          });
      });
    else return message.channel.send("The `Muted` role was not found.");

    const embed = new Discord.MessageEmbed()
      .setTitle("😐 U N M U T E D 😐")
      .setFooter(message.author.tag)
      .setDescription(`Unmuted ${unmutedUsers} users for \`${reason}\``)
      .addField(
        "Unmuted users",
        members.map((member) => member?.user.tag).join("\n")
      )
      .setColor("RANDOM");

    if (couldntUnmute.length)
      embed.addField("Failed to unmute", couldntUnmute.join("\n"));

    return message.channel.send(embed);
  },
} as Command;
