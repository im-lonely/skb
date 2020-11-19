import { Command } from "../types";
import Discord from "discord.js";
import parseMembers from "../parseMembers";

export default {
  name: "kick",
  aliases: ["boot"],
  args: true,
  usage: "<members> [reason]",
  description: "Kick users for the specified reason. Default reason is `None`.",
  execute(message, args, client) {
    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const reason = args.slice(members.length).join(" ") || "None";

    let kickedUsers = 0;
    let couldntKick: string[] = [];

    members.forEach((member) => {
      member
        ?.kick(reason)
        .then(() => {
          kickedUsers++;
        })
        .catch(() => {
          couldntKick.push(member.user.tag);
        });
    });

    const embed = new Discord.MessageEmbed()
      .setTitle("👢 K I C K E D 👢")
      .setFooter(message.author.tag)
      .setDescription(`Kicked ${kickedUsers} users for \`${reason}\``)
      .addField(
        "Kicked users",
        members.map((member) => member?.user.tag).join("\n")
      )
      .setColor("RANDOM");

    if (couldntKick.length)
      embed.addField("Failed to kick", couldntKick.join("\n"));

    message.channel.send(embed);
  },
} as Command;
