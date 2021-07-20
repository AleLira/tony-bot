import { EmbedFieldData, GuildMember, TextChannel } from "discord.js";
import { commandTrigger } from "../config";
import { audio, getTriggerRegex, sendMessage } from ".";

type HelpCommandOpts = {
  channel: TextChannel;
  member: GuildMember;
};

type RunHelpCommandOpts = HelpCommandOpts & {
  command: string;
};

class HelpCommand {
  list({ channel, member }: HelpCommandOpts) {
    const audios = audio.list();
    const content = `Hey, <@!${member}>, here are all ${audios.length} available audios: \n \`\`\`\n${audios.join(
      "\n"
    )}\`\`\``;
    const msgOpts = {
      channel: channel as TextChannel,
      title: "List",
      content,
    };
    return sendMessage.info(msgOpts);
  }

  help({ channel, member }: HelpCommandOpts) {
    const fields: EmbedFieldData[] = [
      {
        name: `-${commandTrigger} help`,
        value: "List all commands",
      },
      {
        name: `-${commandTrigger} list`,
        value: "List all available audios",
      },
      {
        name: `-${commandTrigger} <audioName> <options>`,
        value: "Send an audio",
      },
      {
        name: "\u200B\nSend audio options:",
        value: "\u200B",
      },
      {
        name: "-c <channel>",
        value: "Send audio to specific channel",
      },
      {
        name: "-v <volume>",
        value: "Play audio in specific volume from 0 to 200 (default is 100)",
      },
      {
        name: "-d",
        value: "Auto Delete trigger message after send audio",
      },
      {
        name: "Example:",
        value: `-${commandTrigger} oi -c Mesa de PULSE -v 150 -d`,
      },
    ];
    const content = `Hey, <@!${member}>, here are all available commands:`;

    const msgOpts = {
      channel: channel,
      title: "List",
      content,
      fields,
    };
    return sendMessage.info(msgOpts);
  }

  ping({ channel, member }) {
    const msgOpts = {
      channel: channel as TextChannel,
      content: `Pong, <@!${member}>!`,
    };
    return sendMessage.info(msgOpts);
  }

  async clear({ channel, member }: HelpCommandOpts) {
    const triggerRegex = getTriggerRegex();
    const botId = channel.client.user.id;

    const messages = await channel.messages.fetch();

    const toDelete = messages.filter(
      ({ content, author }) =>
        !!content.match(triggerRegex) || author.id === botId
    );

    return channel.bulkDelete(toDelete);
  }

  runHelpCommand = ({ channel, member, command }: RunHelpCommandOpts) => {
    if (command === "runHelpCommand" || !this[command]) {
      return false;
    }

    const options: HelpCommandOpts = {
      channel,
      member,
    };

    return this[command](options);
  };
}

export default new HelpCommand();
