import Discord from "discord.js";

const parseUsers = (args: string[], message: Discord.Message) =>
  args
    .map((arg) => {
      let copy = arg;
      if (/^<@!?\d{18}>$/.test(copy)) {
        copy = copy.slice(2, -1);

        if (copy.startsWith("!")) {
          copy = copy.slice(1);
        }

        return copy;
      } else if (/^\d{18}$/.test(copy)) {
        return copy;
      } else {
        return undefined;
      }
    })
    .filter((arg) => !!arg)
    .map((id) => message.client.users.cache.get(id!))
    .filter((user) => !!user);

export default parseUsers;
