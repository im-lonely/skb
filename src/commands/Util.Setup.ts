import Command from "../Type.Command";

export default {
  name: "setup",
  aliases: ["ready"],
  args: false,
  usage: "",
  description:
    "Sets up the bot and guild so that the bot can function properly.",
  execute(message, args, client) {
    /* Set up mute role */
    if (
      !client.guilds.cache
        .get("773486815457574913")
        ?.roles.cache.find((r) => r.name === "Muted")
    ) {
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
          client.guilds.cache
            .get("773486815457574913")
            ?.channels.cache.forEach((c) => {
              c.overwritePermissions([
                {
                  id: role.id,
                  deny: ["SEND_MESSAGES"],
                },
              ]);
            });

          role.setPosition(3, { reason: "Override permissions" });
        });
    } else {
      const muted = client.guilds.cache
        .get("773486815457574913")
        ?.roles.cache.find((r) => r.name === "Muted")!;

      client.guilds.cache
        .get("773486815457574913")
        ?.channels.cache.forEach((c) => {
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

      muted.setPosition(3, { reason: "Override permissions" });
    }
  },
} as Command;
