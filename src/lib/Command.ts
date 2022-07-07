import Debug from 'debug';
import {
  GuildMember,
  Message,
  MessageEmbed,
  TextChannel,
  User,
} from 'discord.js';

import { botOwnerDiscordId } from '../config';

type CommandArg<T> = {
  name: string;
  description: string;
  alias?: string;
  isRequired?: boolean;
  type: T;
  multiple?: boolean;
};

export default abstract class Command {
  public abstract readonly aliases: string[];
  public abstract readonly description: string;
  public readonly acceptedArgs?: CommandArg<unknown>[];
  protected readonly debugger = Debug(`Command:${this.constructor.name}`);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public abstract execute(
    message: Message,
    args?: string[],
  ): Promise<void> | void;

  protected userIsAdmin(member: GuildMember, channel: TextChannel): boolean {
    const messageAuthorIsOwner = member.user.id === botOwnerDiscordId;
    const messageAuthorIsAdmin = member
      .permissionsIn(channel)
      .has('ADMINISTRATOR');

    return messageAuthorIsOwner || messageAuthorIsAdmin;
  }

  protected createBaseResponseMessage(
    user: User,
    title?: string,
    description?: string,
  ): MessageEmbed {
    const message = new MessageEmbed()
      .setFooter({
        text: `Requested by: ${user.tag}`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    if (title) {
      message.setTitle(title);
    }

    if (description) {
      message.setDescription(description);
    }

    return message;
  }
}
