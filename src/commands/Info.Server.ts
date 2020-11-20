import Discord from "discord.js";
import Command from "../Type.Command";
import parseCase from "../utils/Parse.Case";

export default {
  name: "serverinfo",
  aliases: ["si"],
  args: false,
  usage: "",
  description: "Displays general server info.",
  execute(message, args, client) {
    const { guild } = message;
    const channels = message.guild?.channels.cache.filter(
      (c) => c.type !== "category"
    );
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(guild?.name)
        .setImage(guild?.iconURL()!)
        .setDescription(guild?.description || "No description")
        .addField("Members", guild?.memberCount || "Not found")
        .addField(
          "Online",
          guild?.members.cache.filter((m) => m.presence.status === "online")
            .size,
          true
        )
        .addField(
          "Idle",
          guild?.members.cache.filter((m) => m.presence.status === "idle").size,
          true
        )
        .addField(
          "Offline",
          guild?.members.cache.filter((m) => m.presence.status === "offline")
            .size,
          true
        )
        .addField("Region", guild?.region || "Not found")
        .addField("Channels", guild?.channels.cache.size || "Not found", true)
        .addField("Roles", guild?.roles.cache.size || "Not found", true)
        .addField("Id", guild?.id || "Not found")
        .addField(
          "Text channels",
          channels?.filter((c) => c.type === "text").size,
          true
        )
        .addField(
          "Voice channels",
          channels?.filter((c) => c.type === "voice").size,
          true
        )
        .addField(
          "News channels",
          channels?.filter((c) => c.type === "news").size,
          true
        )
        .addField(
          "Verification level",
          parseCase(guild?.verificationLevel || "") || "Not found"
        )
        .addField(
          "Boosts",
          `${guild?.premiumSubscriptionCount || 0} boosts`,
          true
        )
        .addField("Boost level", guild?.premiumTier || "Not found", true)
        .setColor("RANDOM")
        .setFooter(client.user?.tag)
        .setTimestamp(message.createdAt)
    );
  },
} as Command;
