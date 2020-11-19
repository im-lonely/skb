import Discord from "discord.js";
import parseUsers from "./parseUsers";

const parseMembers = (args: string[], message: Discord.Message) =>
  parseUsers(args, message).map((user) =>
    message.guild?.members.cache.get(user?.id!)
  );

export default parseMembers;
