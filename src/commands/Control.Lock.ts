import failsRef from "..";
import Command from "../Type.Command";
import parseChannels from "../utils/Parse.Channels";

export default {
  name: "lock",
  aliases: ["disable"],
  args: false,
  usage: "[channel]",
  description: "Locks a channel, to unlock it use the unlock command.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("MANAGE_CHANNELS")) return;

    const channel = parseChannels(args, message)[0] || message.channel;

    if (channel.type !== "text") return;

    message.guild?.roles.cache.forEach((role) => {
      channel
        //@ts-ignore – We check if the channel is a text channel
        .overwritePermissions(
          [
            {
              id: role.id,
              deny: ["SEND_MESSAGES"],
            },
          ],
          `Requested by ${message.author.id}`
        )
        .catch(() => {
          failsRef.current++;
        });
    });
  },
} as Command;
