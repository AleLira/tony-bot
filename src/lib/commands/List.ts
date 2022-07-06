import { Message } from 'discord.js';

import AudioManager from '../AudioManager';
import Command from '../Command';

export default class List extends Command {
  public readonly aliases = ['list', 'audios'];
  public readonly description = 'List all available audios';
  private audioManager = AudioManager.getInstance();

  private listAudios(guildId: string): string[] {
    const audios = this.audioManager.guildAudios(guildId);

    return Object.keys(audios).sort();
  }

  private splitAudiosList(audios: string[]): string[][] {
    const threePartIndex = Math.ceil(audios.length / 3);

    return [
      audios.splice(0, threePartIndex),
      audios.splice(0, threePartIndex),
      audios,
    ];
  }

  public execute(message: Message): void {
    const audios = this.listAudios(message.guild.id);

    const audioCount = audios.length;

    const splittedList = this.splitAudiosList(audios).filter(
      (list) => list.length,
    );

    const responseTitle = 'Audio List';
    const responseDescription = `Here you find the names of all ${audioCount} available audios`;

    const responseMessage = this.createBaseResponseMessage(
      message.author,
      responseTitle,
      responseDescription,
    );

    responseMessage.addFields(
      splittedList.map((part) => ({
        name: '\u200B',
        value: part.join('\n'),
        inline: true,
      })),
    );

    message.reply({ embeds: [responseMessage] });
    return;
  }
}
