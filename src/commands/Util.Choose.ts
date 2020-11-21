import Command from "../Type.Command";

export default {
  name: "choose",
  aliases: ["pick"],
  args: true,
  usage: "<item> <item> [item [item]...]",
  description: "Let the bot decide what to choose!",
  async execute(message, args, client) {
    if (!args.length) return message.channel.send("No items to pick!");
    if (args.length === 1)
      return message.channel.send("There's only one item to pick!");
    return message.channel.send(
      `I choose \`${args[Math.floor(Math.random() * args.length)]}\`!`
    );
  },
} as Command;
