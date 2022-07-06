import { Message, TextChannel } from 'discord.js';

import Command from '../Command';
import { isCommand } from '../helpers';

export default class Clear extends Command {
  public readonly aliases = ['clear', 'clean'];
  public readonly description = 'Clean bot and trigger messages.';

  public async execute(message: Message): Promise<void> {
    const { guild, author } = message;

    const channel = <TextChannel>message.channel;

    this.debugger(
      `Cleaning messages from ${guild.name}/${channel.name} by request of ${author.tag}`,
    );

    const botId = channel.client.user.id;

    const messages = await channel.messages.fetch();

    const toDelete = messages.filter(
      ({ content, author }) =>
        isCommand(content.split(' ').shift()) || author.id === botId,
    );

    channel.bulkDelete(toDelete);

    return;
  }
}
