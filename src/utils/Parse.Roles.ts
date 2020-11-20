import Discord from "discord.js";

const parseRoles = (args: string[], message: Discord.Message) =>
  args
    .map((arg) => {
      if (/^<@&\d{18}>$/.test(arg)) return arg.slice(3, -1);
      else if (/^\d{18}$/.test(arg)) return arg;
      else return undefined;
    })
    .filter((arg) => !!arg)
    .map((id) =>
      message.client.guilds.cache.get(message.guild?.id!)?.roles.cache.get(id!)
    )
    .filter((role) => !!role);

export default parseRoles;
