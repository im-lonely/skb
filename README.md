# skb

### This repository is here to help you build your own bot with basic commands, utilities, and examples.

I used TypeScript to create this bot so keep in mind that you'll have to remove the typings if you are using JavaScript.
I'm still a really bad coder so if there's something wrong, please open an issue or pull request!

### Commands

#### Moderation

- Ban, Softban, Tempban, Unban
- Kick
- Lock/Unlock, Mute/Unmute
- Slowmode

#### Info

- Server
- Role
- User
- Client

#### Utils

- Choose
- Coin
- Help
- Poll
- Setup

### Utilities

- parseCase for parsing `MACRO_CASE` to `Macro Case`
- parseChannel for parsing channel mentions or ids into channel objects
- parseList for parsing arrays into readable english
- parseMembers for parsing user mentions or ids into member objects
- parseRoles for parsing role mentions or ids into role objects
- parseTrim for parsing a string and trimming the end if it's too long and adding `...`
- parseUsers for parsing user mentions or ids into user objects

#### You will find examples in the command files, and you will find the utilities in the `utils` folder

#### The discord.js guide is one of the best I've ever seen. Please do follow it if you just begin.
