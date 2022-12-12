import { Message } from 'discord.js';

import { botName, packageData } from '../../config';
import Command from '../Command';

export default class About extends Command {
  public readonly aliases = ['about'];
  public readonly description = 'Shows bot Info';

  public async execute(message: Message): Promise<void> {
    const { default: prettyMilliseconds } = await import('pretty-ms');

    const responseMessage = this.createBaseResponseMessage(
      message.author,
      botName,
    );

    const uptime = prettyMilliseconds(message.client.uptime);

    responseMessage.addFields({ name: 'Version', value: packageData.version });
    responseMessage.addFields({ name: 'Author', value: packageData.author });
    responseMessage.addFields({
      name: 'Repository',
      value: packageData.homepage,
    });
    responseMessage.addFields({ name: 'Uptime', value: uptime });

    message.reply({ content: null, embeds: [responseMessage] });
    return;
  }
}
