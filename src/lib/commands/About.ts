import { Message } from 'discord.js';

import { botName, ContributorInfo, packageData } from '../../config';
import Command from '../Command';
import { dynamicImport } from '../helpers';

export default class About extends Command {
  public readonly aliases = ['about'];
  public readonly description = 'Shows bot Info';

  private formatCollaboratorString(
    contributorInfo: ContributorInfo | string,
  ): string {
    if (typeof contributorInfo === 'string') {
      return contributorInfo;
    }
    const { name, url } = contributorInfo;

    return url ? `[${name}](${url})` : name;
  }

  public async execute(message: Message): Promise<void> {
    const { default: prettyMilliseconds } = await dynamicImport('pretty-ms');

    const responseMessage = this.createBaseResponseMessage(
      message.author,
      botName,
    );

    const uptime = prettyMilliseconds(message.client.uptime);

    responseMessage.addFields({
      name: 'Current version is',
      value: packageData.version,
    });
    responseMessage.addFields({
      name: 'Created by',
      value: this.formatCollaboratorString(packageData.author),
    });

    if (packageData.contributors?.length) {
      responseMessage.addFields({
        name: 'With amazing contributions from',
        value: packageData.contributors
          .map((contributor: ContributorInfo | string) =>
            this.formatCollaboratorString(contributor),
          )
          .join('\n'),
      });
    }
    responseMessage.addFields({
      name: 'Repository can be found here',
      value: packageData.homepage,
    });
    responseMessage.addFields({ name: 'Current uptime is', value: uptime });

    message.reply({ content: null, embeds: [responseMessage] });
    return;
  }
}
