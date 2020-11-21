import Discord from "discord.js";
import ms from "ms";
import Command from "../Type.Command";
import parseChannels from "../utils/Parse.Channels";
import parseTrim from "../utils/Parse.Trim";

export default {
  name: "poll",
  aliases: ["ask", "question"],
  args: true,
  usage: "<channel> | <poll> | <options> | <time>",
  description:
    "Set up a simple poll with the question, options, and time. 10 options max, 1 day time max.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("ADMINISTRATOR")) return;

    const numbers = [
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
    ];

    const channel =
      (parseChannels(
        getFirst(
          await prompt("Where will the poll be posted?", message)
        )!.split(/ +/)!,
        message
      ).filter((c) => c?.type === "text")[0] as Discord.TextChannel) ||
      (message.channel as Discord.TextChannel);

    const question = getFirst(await prompt("What's the poll?", message));

    if (!question) return message.channel.send("No question found.");

    const options = (
      await prompt(
        "What are the options (10 options max)? Enter them like this: `option | option ...`",
        message
      )
    )
      .first()
      ?.content.split("|")
      .map((o) => o.trim());

    if (options!.length > 10)
      return message.channel.send("You must have no more than 10 options!");

    if (!options?.length) return message.channel.send("No options found.");

    const time = ms(
      getFirst(
        await prompt("How long do you want the poll to last?", message)
      ) || ""
    );

    if (!time || time > ms("1d"))
      return message.channel.send(
        "The time cannot be more than one day and you must specify a correct time!"
      );

    // const poll = await channel?.send(
    //   `**${question}**\n${options.map((o, i) => numbers[i] + " – " + o)}`
    // );

    const date = new Date(ms(time));
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    const poll = await channel.send(
      new Discord.MessageEmbed()
        .setTitle(parseTrim(question, 256))
        .setDescription(
          `Poll created by ${message.author.tag}.\nLasts for ${h} hours, ${m} minutes, and ${s} seconds.`
        )
        .addField("Question", question)
        .addField(
          "Options",
          options.map((o, i) => `${numbers[i]} – ${o}`).join("\n")
        )
        .setColor("RANDOM")
        .setFooter(client.user?.tag)
        .setTimestamp(message.createdAt)
    );

    const emojiNumberMap: any = {};

    numbers.slice(options?.length).forEach(async (n) => {
      const r = await poll.react(n);
      emojiNumberMap[r.emoji.name] = n;
    });

    const collected = (
      await poll.awaitReactions((r) => numbers.includes(r.emoji.name), {
        time,
      })
    ).array();

    const totals: any = {};

    for (const reaction of collected) {
      totals[reaction.emoji.name] = totals[reaction.emoji.name]
        ? totals[reaction.emoji.name] + 1
        : 1;
    }

    //@ts-ignore – Object.values(totals) is an array of numbers
    const max = Math.max(...Object.values(totals));

    const mosts = Object.keys(totals)
      .map((key) =>
        totals[key] === max
          ? options[numbers.indexOf(emojiNumberMap[key])]
          : undefined
      )
      .filter((m) => !!m);

    poll.edit(
      new Discord.MessageEmbed()
        .setTitle("Poll over!")
        .setDescription(question)
        .addField(
          "Closed",
          `This poll is closed.\nThe poll took place from \`${
            message.createdAt
          }\` to \`${new Date()}\`.\nCheck the results!`
        )
        .addField("Results", mosts.join("\n"))
        .setColor("RANDOM")
        .setFooter(client.user?.tag)
        .setTimestamp(message.createdAt)
    );
  },
} as Command;

/* Dependencies */

const prompt = async (prompt: string, message: Discord.Message) => {
  const msg = await message.channel.send(prompt);
  return msg.channel.awaitMessages(() => true, {
    max: 1,
    time: 10000,
  });
};

const getFirst = (collection: Discord.Collection<string, Discord.Message>) =>
  collection.first()?.content;
