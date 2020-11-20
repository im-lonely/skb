import Discord from "discord.js";
import Command from "../Command";
import parseCase from "../utils/parseCase";
import parseRoles from "../utils/parseRoles";
import parseTrim from "../utils/parseTrim";

export default {
  name: "userinfo",
  aliases: ["ui"],
  args: false,
  usage: "[user]",
  description: "Displays general server info.",
  execute(message, args, client) {
    const { guild } = message;
  },
} as Command;
