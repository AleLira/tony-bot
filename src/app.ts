import 'dotenv/config';
import Debug from 'debug';
import { Client, Intents, Message } from 'discord.js';
import stringArgv from 'string-argv';

import { botName, commandTrigger, discordToken } from './config';
import AudioManager from './lib/AudioManager';
import CommandManager from './lib/CommandManager';
import { isCommand } from './lib/helpers';

const debug = Debug(`${botName}:main:`);

async function main(): Promise<void> {
  debug('Starting Bot!');
  const intents = new Intents();
  intents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
  );
  const bot = new Client({
    intents: intents,
  });

  debug('Loading Commands');
  const manager = CommandManager.getInstance();
  await manager.load();

  debug('Loading Audios');
  const audioManager = AudioManager.getInstance();
  audioManager.load();

  debug('Authenticating with Discord');
  bot.login(discordToken);

  bot.on('ready', () => {
    bot.user?.setPresence({
      activities: [{ name: `-${commandTrigger} <command>`, type: 'LISTENING' }],
    });

    debug(`Ready! Logged in as ${bot.user.tag}`);
  });

  bot.on('messageCreate', (message: Message) => {
    const { content, author } = message;

    if (author.bot) return;

    const argv = stringArgv(content);
    const firstMessageFragment = argv.shift();

    if (!isCommand(firstMessageFragment)) {
      return;
    }

    let command = argv.shift();

    if (!manager.exists(command)) {
      argv.unshift(command);
      command = 'audio';
    }

    manager.run(command, message, argv);
  });
}

main();
