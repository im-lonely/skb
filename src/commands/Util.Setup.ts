import Command from "../Type.Command";

export default {
  name: "setup",
  aliases: ["ready"],
  args: false,
  usage: "",
  description:
    "Sets up the bot and guild so that the bot can function properly.",
  async execute(message, args, client) {
    if (!message.member?.hasPermission("ADMINISTRATOR")) return;

    /* Set up mute role */

    if (!message.guild?.roles.cache.find((r) => r.name === "Muted")) {
      client.guilds.cache
        .get("773486815457574913")
        ?.roles.create({
          data: {
            color: "#777777",
            name: "Muted",
            mentionable: false,
            hoist: false,
          },
          reason: "Set up muted role",
        })
        .then((role) => {
          message.guild?.channels.cache.forEach((c) => {
            c.overwritePermissions([
              {
                id: role.id,
                deny: ["SEND_MESSAGES"],
              },
            ]);
          });

          role.hoist = false;
          role.mentionable = false;

          role.setPosition(3, { reason: "Override permissions" });
        });
    } else {
      const muted = message.guild?.roles.cache.find((r) => r.name === "Muted")!;

      message.guild?.channels.cache.forEach((c) => {
        c.overwritePermissions(
          [
            {
              id: muted.id,
              deny: ["SEND_MESSAGES"],
            },
          ],
          "Set up muted role"
        );
      });

      muted.hoist = false;
      muted.mentionable = false;

      muted.setPosition(3, { reason: "Override permissions" });
    }

    message.channel.send("Mute role set!");
  },
} as Command;
