import Discord from "discord.js";
import Command from "../Type.Command";
import parseList from "../utils/Parse.List";
import { prefix } from "../config.json";
import pkg from "../../package.json";
import failsRef from "..";

export default {
  name: "info",
  aliases: ["i"],
  args: false,
  usage: "[field]",
  description: "Displays general information about the bot.",
  execute(message, args, client) {
    const fields: {
      name: string;
      title?: string;
      fields?: Discord.EmbedField[];
    }[] = [
      {
        name: "ping",
        title: "Client ping",
        fields: [
          {
            name: "Ping",
            value: client.ws.ping.toString(),
            inline: true,
          },
          {
            name: "Latency",
            value: (Date.now() - message.createdTimestamp).toString(),
            inline: true,
          },
        ],
      },
      {
        name: "totals",
        title: "Client Totals",
        fields: [
          {
            name: "Users",
            value: client.users.cache.size.toString(),
            inline: false,
          },
          {
            name: "Channels",
            value: client.channels.cache.size.toString(),
            inline: false,
          },
          {
            name: "Emojis",
            value: client.emojis.cache.size.toString(),
            inline: false,
          },
          {
            name: "Fails",
            value: failsRef.toString(),
            inline: false,
          },
        ],
      },
      {
        name: "package",
        title: "Package info",
        fields: [
          {
            name: "Name",
            value: pkg.name,
            inline: false,
          },
          {
            name: "Version",
            value: pkg.version,
            inline: false,
          },
          {
            name: "Dependencies",
            value: Object.keys(pkg.dependencies).join("\n"),
            inline: false,
          },
          {
            name: "License",
            value: pkg.license,
            inline: false,
          },
        ],
      },
      {
        name: "client",
        title: "Client info",
        fields: [
          {
            name: "User",
            value: "Username:\nDiscriminator:\nTag:\nId:",
            inline: true,
          },
          {
            name: "Info",
            value: `${client.user?.username}\n${client.user?.discriminator}\n${client.user?.tag}\n${client.user?.id}`,
            inline: true,
          },
          {
            name: "User created at",
            value: client.user?.createdAt.toString()!,
            inline: false,
          },
          {
            name: "Uptime",
            value: client.uptime?.toString()!,
            inline: false,
          },
        ],
      },
      {
        name: "about",
        title: "About",
        fields: [
          {
            name: "Author",
            value: "[Cursors]#9257",
            inline: false,
          },
          {
            name: "Notes Stuff",
            value:
              "This bot was given for free – the author had way too much time on its hands.\nIt even had enough time to make a framework out of this bot.\nYes, the author's pronouns are it/its/it's.",
            inline: false,
          },
          {
            name: "Technical Stuff",
            value:
              "This simple bot was coded in TypeScript, which is JavaScript but with strong typing, like Java or C#.\nThe library used to interact with the Discord API was discord.js, which includes TypeScript typings.",
            inline: false,
          },
          {
            name: "Advertising Stuff",
            value:
              "If you want a custom bot like this contact the author.\nYou shouldn't request a complex bot because the author will cry itself to sleep every night.\nPlease keep in mind that the author is just a cursor!",
            inline: false,
          },
        ],
      },
    ];

    if (!args.length || !fields.some((f) => f.name === args[0]))
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(`General info`)
          .setFooter(client.user?.tag)
          .setColor("RANDOM")
          .setTimestamp(message.createdAt)
          .setDescription(
            `Available fields are ${parseList(
              fields.map((f) => "`" + f.name + "`")
            )}.`
          )
          .addField("Ping", client.ws.ping)
          .addField("Users", client.users.cache.size)
          .addField("Version", pkg.version)
          .addField("Uptime", client.uptime + "ms")
          .addField("Client Tag", client.user?.tag)
          .addField("Client Id", client.user?.id)
          .addField("Prefix", prefix)
      );

    const field = fields[fields.map((f) => f.name).indexOf(args[0])];

    return message.channel.send(
      new Discord.MessageEmbed({
        title: field.title,
        fields: field.fields,
        image: {
          url:
            field.name === "client"
              ? client.user?.displayAvatarURL()
              : undefined,
        },
      })
        .setDescription(`Displaying info for the field ${field.name}`)
        .setColor("RANDOM")
        .setFooter(client.user?.tag)
        .setTimestamp(message.createdAt)
    );
  },
} as Command;
