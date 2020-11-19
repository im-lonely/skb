import { Command } from "../types";

export default {
  name: "slowmode",
  aliases: ["ratelimit"],
  args: true,
  usage: "<seconds> [reason]",
  description: "Sets a slowmode in seconds. Default reason is `None`",
  execute(message, args, client) {
    const seconds = Number(args[0]);

    const reason = args.slice(1).join(" ") || "None";

    if (args[0] === "off")
      //@ts-ignore – This method exists, checked index.d.ts
      return message.channel.setRateLimitPerUser(0, reason);

    if (Number.isNaN(seconds) || !seconds || seconds === null)
      return message.channel.send("That's not a number.");

    if (seconds < 2)
      return message.channel.send("Enter an amount greater than 1");

    //@ts-ignore – This method exists, checked index.d.ts
    message.channel.setRateLimitPerUser(seconds, reason);
  },
} as Command;