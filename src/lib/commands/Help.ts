import { Message } from 'discord.js';

import { botName, commandTrigger } from '@/config';

import Command from '../Command';
import CommandManager from '../CommandManager';
import InvalidCommandException from '../exceptions/InvalidCommandException';

export default class Help extends Command {
  public readonly aliases = ['help', '?'];
  public readonly description =
    'Shows available command list. If called with a command, shows the command details';
  private commandManager = CommandManager.getInstance();

  private sendHelpMenu(message: Message): void {
    const commands = this.commandManager.allAliases().sort();

    const responseTitle = `${botName} Help`;
    const responseDescription = `Use -${commandTrigger} help <command> to get more info on a specific command!`;

    const responseMessage = this.createBaseResponseMessage(
      message.author,
      responseTitle,
      responseDescription,
    );

    responseMessage.addField(
      'Available Commands',
      commands.map((command) => `\`${command}\``).join(' '),
    );

    message.reply({ embeds: [responseMessage] });
  }

  private sendCommandHelp(message: Message, command: string): void {
    try {
      const commandMetadata = this.commandManager.commandMetadata(command);

      const responseTitle = `${commandMetadata.name} Help`;

      const responseMessage = this.createBaseResponseMessage(
        message.author,
        responseTitle,
        commandMetadata.description,
      );

      responseMessage.addField(
        'Aliases',
        commandMetadata.aliases
          .map((alias) => (alias ? `\`${alias}\`` : ''))
          .join(' '),
      );

      const commandUsageArr = [
        `-${commandTrigger} ${commandMetadata.aliases[0]}`,
      ];

      if (commandMetadata.acceptedArgs?.length) {
        responseMessage.addField(
          'Accepted Arguments',
          commandMetadata.acceptedArgs
            .map((arg) => {
              const fragments = [
                '`' + arg.name + '`',
                arg.isRequired ? ' (required)' : '',
                ': ' + arg.description,
              ];
              const argUsage =
                '`' +
                (arg.alias && arg.alias !== commandTrigger
                  ? `-${arg.alias} `
                  : '') +
                (arg.type !== Boolean ? `<${arg.name}>` : '') +
                '`';

              commandUsageArr.push(argUsage);

              return fragments.join('');
            })
            .join('\n'),
        );
      }

      responseMessage.addField('Usage', commandUsageArr.join(' '));

      message.reply({ embeds: [responseMessage] });

      return;
    } catch (exception) {
      if (exception instanceof InvalidCommandException) {
        message.reply(exception.message);
      }
    }
  }

  public execute(message: Message, args: string[]): void {
    if (!args.length) {
      return this.sendHelpMenu(message);
    }

    return this.sendCommandHelp(message, args.shift());
  }
}
