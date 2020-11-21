import Command from "../Type.Command";
import Discord from "discord.js";
import parseMembers from "../utils/Parse.Members";
import failsRef from "..";
import ms from "ms";

export default {
  name: "mute",
  aliases: ["shut"],
  args: true,
  usage: "<members> <time> [reason]",
  description:
    "Mute users for the specified reason and for an amount of time. Default reason is `None`.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("KICK_MEMBERS")) return;

    const members = parseMembers(args, message);

    if (!members) return message.channel.send("I couldn't find the users!");

    const time = ms(args.slice(members.length, members.length + 1)[0]);

    const reason = args.slice(members.length + 1).join(" ") || "None";

    let mutedUsers = 0;
    let couldntMute: string[] = [];

    if (message.guild?.roles.cache.find((r) => r.name === "Muted")) {
      members.forEach((member) => {
        member?.roles
          .add(message.guild?.roles.cache.find((r) => r.name === "Muted")!)
          .then(() => {
            mutedUsers++;
          })
          .catch(() => {
            failsRef.current++;
            couldntMute.push(member.user.tag);
          });
      });

      if (time)
        setTimeout(() => {
          members.forEach((member) => {
            member?.roles.remove(
              message.guild?.roles.cache.find((r) => r.name === "Muted")!
            );
          }, time);
        });
    } else
      return message.channel.send(
        "The `Muted` role was not found. Restart the bot to setup it up again."
      );

    const embed = new Discord.MessageEmbed()
      .setTitle("🤐 M U T E D 🤐")
      .setFooter(message.author.tag)
      .setDescription(
        `Muted ${mutedUsers} users for \`${reason}\`${
          time
            ? ""
            : "\nYour time could not be parse so instead the users have been muted indefinitely."
        }`
      )
      .addField(
        "Muted users",
        members.map((member) => member?.user.tag).join("\n")
      )
      .setColor("RANDOM");

    if (couldntMute.length)
      embed.addField("Failed to mute", couldntMute.join("\n"));

    return message.channel.send(embed);
  },
} as Command;
