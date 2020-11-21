import failsRef from "..";
import Command from "../Type.Command";

export default {
  name: "limit",
  aliases: ["slowmode", "ratelimit"],
  args: true,
  usage: "<seconds> [reason]",
  description: "Sets a slowmode in seconds. Default reason is `None`",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("MANAGE_CHANNELS")) return;

    const seconds = Number(args[0]);

    const reason = args.slice(1).join(" ") || "None";

    if (args[0] === "off") {
      message.channel.send("Slowmode was turned off!");
      //@ts-ignore – This method exists, checked index.d.ts
      return message.channel.setRateLimitPerUser(0, reason);
    }
    if (Number.isNaN(seconds) || seconds === null)
      return message.channel.send("That's not a number.");

    if (seconds < 0)
      return message.channel.send("Enter an amount greater than 0.");

    message.channel
      //@ts-ignore – This method exists, checked index.d.ts
      .setRateLimitPerUser(seconds, reason)
      .then(() => {
        message.channel.send("Slowmode successfully set!");
      })
      .catch(() => {
        failsRef.current++;
      });
  },
} as Command;
