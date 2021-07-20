import "dotenv/config";
import { Client, Message, VoiceChannel, TextChannel } from "discord.js";
import {
  audio as audioHelper,
  helpCommands,
  parseArguments,
  sendMessage,
  locker,
  getTriggerRegex,
} from "./helpers";
import { isLocked, lock, unlock } from "./helpers/locker";
import { commandTrigger, discordToken } from "./config";

const handleMessage = async (message: Message) => {
  const { content, member, guild, channel: messageChannel } = message;

  if (!content.match(getTriggerRegex())) {
    return;
  }

  const { audio, channel, volume, autoDelete } = parseArguments(
    content,
    commandTrigger
  );

  const helpCommandOptions = {
    channel: messageChannel as TextChannel,
    command: audio,
    member,
  };

  if (autoDelete) {
    message.delete();
  }

  if (helpCommands.runHelpCommand(helpCommandOptions)) {
    return;
  }

  if (isLocked(guild)) {
    const content = `Sorry, <@!${member}>, I'm busy now, just wait a second and try again`;
    return sendMessage.info({
      channel: messageChannel as TextChannel,
      content,
    });
  }

  const audioPath = audioHelper.path(audio);

  if (!audio || !audioPath) {
    return sendMessage.error({
      channel: messageChannel as TextChannel,
      content: `Invalid audio! Check list with command\n \`\`\`-${commandTrigger} list\`\`\``,
    });
  }

  let botChannel = member.voice.channel;

  if (channel) {
    const channelSearch = guild.channels.cache.find(
      ({ name, type }) =>
        name.toLowerCase() === channel.toLowerCase() && type === "voice"
    );

    if (!channelSearch) {
      return sendMessage.error({
        channel: messageChannel as TextChannel,
        content: `Channel '${channel}' not found or not a voice channel`,
      });
    }

    botChannel = channelSearch as VoiceChannel;
  }

  if (!botChannel) {
    return sendMessage.error({
      channel: messageChannel as TextChannel,
      content: "User is not in a voice channel",
    });
  }

  try {
    lock(guild);
    const connection = await botChannel.join();

    const dispatcher = connection.play(audioPath, {
      volume,
    });

    dispatcher.on("finish", () => {
      botChannel.leave();
      unlock(guild);
    });
  } catch (err) {
    console.error(err);
  }
};

async function main() {
  const bot = new Client();
  bot.on("message", handleMessage);

  await bot.login(discordToken);

  console.log("\x1b[36m", "Bot is ready! Waiting for commands...", "\x1b[0m");
}

main();
