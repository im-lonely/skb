import Discord from "discord.js";

const parseChannels = (args: string[], message: Discord.Message) =>
  args
    .map((arg) => {
      if (/^<#\d{18}>$/.test(arg)) return arg.slice(2, -1);
      else if (/^\d{18}$/.test(arg)) return arg;
      else return undefined;
    })
    .filter((arg) => !!arg)
    .map((id) => message.client.channels.cache.get(id!))
    .filter((channel) => !!channel);

export default parseChannels;
