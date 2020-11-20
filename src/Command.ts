import Discord from "discord.js";

type Command = {
  name: string;
  aliases: string[];
  description: string;
  args: boolean;
  usage: string;
  execute(
    message: Discord.Message,
    args: string[],
    client: Discord.Client
  ): any;
};

export default Command;
