import axios from 'axios';
import { Message, MessageAttachment, TextChannel } from 'discord.js';

import AudioManager from '../AudioManager';
import Command from '../Command';
import CommandManager from '../CommandManager';
import FileNotAudioException from '../exceptions/FileNotAudioException';
import InvalidAudioNameException from '../exceptions/InvalidAudioNameException';
import NoAttachmentException from '../exceptions/NoAttachmentException';
import PermissionDeniedException from '../exceptions/PermissionDeniedException';

export type AudioMetadata = {
  name: string;
  extension: string;
};

export default class Upload extends Command {
  public readonly aliases = ['upload'];
  public readonly description =
    'Uploads a new audio to the bot. The audio file must be attached to the message.';
  public readonly acceptedArgs = [
    {
      name: 'audio',
      description: 'The audio title you want to upload',
      isRequired: true,
      type: String,
    },
  ];

  private readonly audioManager = AudioManager.getInstance();
  private readonly commandManager = CommandManager.getInstance();

  private async downloadFile(attachment: MessageAttachment): Promise<Buffer> {
    const { headers, data } = await axios.get<Buffer>(attachment.url, {
      responseType: 'arraybuffer',
    });

    if (!headers['content-type'].match(/^audio\//)) {
      throw new FileNotAudioException();
    }

    return data;
  }

  private parseAudioName(
    attachment: MessageAttachment,
    nameArg: string,
  ): AudioMetadata {
    const attachmentNameArr = attachment.name.split('.');
    const extension = attachmentNameArr.pop();
    let audioName = attachmentNameArr.join('');

    if (nameArg) {
      audioName = nameArg;
    }

    const parsedName = this.audioManager.sanitizeAudioName(audioName);

    if (!parsedName) {
      throw new InvalidAudioNameException(audioName);
    }

    return { name: parsedName, extension };
  }

  private audioNameIsValid(audioName: string, guildId: string): void {
    if (this.audioManager.existsInGuild(guildId, audioName)) {
      throw new InvalidAudioNameException(
        audioName,
        `An audio called '${audioName}' already exists`,
      );
    }

    if (this.commandManager.exists(audioName)) {
      throw new InvalidAudioNameException(
        audioName,
        `'${audioName}' is a Bot Command and cannot be used as audio name`,
      );
    }
  }

  public async execute(message: Message, args: string[]): Promise<void> {
    const guildId = message.guild.id;
    const attachment = message.attachments.first();
    const nameArg = args.join('');

    const { member, channel } = message;

    try {
      const isAdmin = this.userIsAdmin(member, channel as TextChannel);

      if (!isAdmin) {
        throw new PermissionDeniedException(this.constructor.name);
      }

      if (!attachment) {
        throw new NoAttachmentException();
      }

      const fileBuffer = await this.downloadFile(attachment);
      const audioMetadata = this.parseAudioName(attachment, nameArg);

      this.audioNameIsValid(audioMetadata.name, guildId);

      const fileName = `${audioMetadata.name}.${audioMetadata.extension}`;

      this.audioManager.saveAndRegister(guildId, fileName, fileBuffer);

      message.reply(
        `Your audio has been saved and is available as **\`${audioMetadata.name}\`**`,
      );
    } catch (ex) {
      let messageText = ex.message;
      let messageTitle = 'Error! 🛑';

      if (ex instanceof InvalidAudioNameException) {
        messageText = ex.message.replace(/\'/g, '**');
      }

      if (ex instanceof PermissionDeniedException) {
        messageTitle = 'Permission Denied 🛑';
        messageText = 'Only Bot Owner and Server Admins can upload new audios';
      }

      const repsonseMessage = this.createBaseResponseMessage(
        message.author,
        messageTitle,
        messageText,
      );

      message.reply({ embeds: [repsonseMessage] });
    }
  }
}
