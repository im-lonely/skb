import Discord from "discord.js";
import Command from "../Type.Command";
import parseUsers from "../utils/Parse.User";

export default {
  name: "userinfo",
  aliases: ["ui"],
  args: false,
  usage: "[user]",
  description: "Displays general user info",
  execute(message, args, client) {
    const user = parseUsers(args, message)[0] || message.author;
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(user.username)
        .setImage(user.displayAvatarURL())
        .setDescription(`Status: \`${user.presence.status}\``)
        .addField("Username", user.username, true)
        .addField("Tag", user.tag, true)
        .addField("Id", user.id)
        .addField("Account created", user.createdAt)
        .setColor("RANDOM")
        .setFooter(message.author.tag)
        .setTimestamp(message.createdAt)
    );
  },
} as Command;
