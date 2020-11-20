import Command from "../Type.Command";
import parseChannels from "../utils/Parse.Channels";

export default {
  name: "lock",
  aliases: ["disable"],
  args: false,
  usage: "[channel]",
  description: "Locks a channel, to unlock it use the unlock command.",
  execute(message, args, client) {
    if (!message.member?.hasPermission("MANAGE_CHANNELS")) return;

    const channel = parseChannels(args, message)[0] || message.channel;
    message.guild?.roles.cache.forEach((role) => {
      if (message.channel.type === "dm") return;
      message.channel.overwritePermissions(
        [
          {
            id: role.id,
            deny: ["SEND_MESSAGES"],
          },
        ],
        `Requested by ${message.author.id}`
      );
    });
  },
} as Command;
