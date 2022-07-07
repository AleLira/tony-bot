import { Message } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';

import { botName, packageData } from '../../config';
import Command from '../Command';

export default class About extends Command {
  public readonly aliases = ['about'];
  public readonly description = 'Shows bot Info';

  public async execute(message: Message): Promise<void> {
    const responseMessage = this.createBaseResponseMessage(
      message.author,
      botName,
    );

    const uptime = prettyMilliseconds(message.client.uptime);

    responseMessage.addField('Version', packageData.version);
    responseMessage.addField('Author', packageData.author);
    responseMessage.addField('Repository', packageData.homepage);
    responseMessage.addField('Uptime', uptime);

    message.reply({ content: null, embeds: [responseMessage] });
    return;
  }
}
