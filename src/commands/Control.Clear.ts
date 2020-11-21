import failsRef from "..";
import Command from "../Type.Command";

export default {
  name: "clear",
  aliases: ["purge", "clean", "wipe"],
  args: true,
  usage: "<amount>",
  description: "Cleans the current channel by clearing messages.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("MANAGE_MESSAGES")) return;

    const amount = Number(args[0]);

    if (Number.isNaN(amount) || !amount || amount === null)
      return message.channel.send("That's not a number.");

    if (amount < 2)
      return message.channel.send("Enter an amount greater than 1");

    const last100 = Math.floor(amount / 100);
    const leftOver = amount % 100;

    const promises = [];

    for (let i = 0; i < last100; i += 100)
      //@ts-ignore – This is command is only used in a guild
      promises.push(message.channel.bulkDelete(100));

    return Promise.all(promises)
      .then(() => {
        //@ts-ignore – This command is only used in a guild
        message.channel.bulkDelete(leftOver);
      })
      .then(() => {
        message.channel.send(`I have deleted ${amount} messages!`);
      })
      .catch(() => {
        failsRef.current++;
        message.channel.send("Failed to delete some messages!");
      });
  },
} as Command;
