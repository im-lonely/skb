import Discord from "discord.js";
import failsRef from "..";
import Command from "../Type.Command";
import parseChannels from "../utils/Parse.Channels";

export default {
  name: "unlock",
  aliases: ["enable"],
  args: false,
  usage: "<channel>",
  description: "Unlocks a locked channel.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("MANAGE_CHANNELS")) return;

    const channel = parseChannels(args, message)[0];

    if (!channel) return message.channel.send("Channel not found!");

    message.guild?.roles.cache.forEach((role) => {
      channel
        //@ts-ignore – We check if the channel is a text channel
        .overwritePermissions(
          [
            {
              id: role.id,
              allow: ["SEND_MESSAGES"],
            },
          ],
          `Requested by ${message.author.id}`
        )
        .catch(() => {
          failsRef.current++;
        });
    });

    message.channel.send("Unlocked!");
  },
} as Command;
