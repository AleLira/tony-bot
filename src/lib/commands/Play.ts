import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';
import commandLine from 'command-line-args';
import { Guild, Message, VoiceChannel } from 'discord.js';
import { Readable } from 'stream';

import { commandTrigger } from '../../config';
import AudioManager from '../AudioManager';
import Command from '../Command';
import InvalidAudioException from '../exceptions/InvalidAudioException';
import InvalidVoiceChannelException from '../exceptions/InvalidVoiceChannelException';
import UserNotInVoiceChannelException from '../exceptions/UserNotInVoiceChannelException';
import Locker from '../Locker';

type AudioCommandArgs = {
  audio: string;
  voiceChannel?: string;
  volume?: number;
  autoDelete?: number;
};

export default class Play extends Command {
  public readonly aliases = ['', 'play', 'audio'];
  public readonly description =
    'Play the specified audio on a voice channel. You can send the audio to another channel, set the volume and autodelete the trigger message to be stealth.';
  public readonly acceptedArgs = [
    {
      name: 'audio',
      description: 'The audio title you want to play',
      alias: commandTrigger,
      isRequired: true,
      type: String,
      multiple: true,
    },
    {
      name: 'voice-channel',
      description:
        "The voice channel you want to send the audio (default is the channel you're in)",
      alias: 'c',
      type: String,
      multiple: true,
    },
    {
      name: 'volume',
      description:
        'The volume to play the audio between 1 and 200 (default is 100)',
      alias: 'v',
      type: String,
    },
    {
      name: 'auto-delete',
      description: 'Send this if you want to auto delete the trigger message',
      alias: 'd',
      type: Boolean,
    },
  ];
  private readonly audioManager = AudioManager.getInstance();

  private parseArgs(args: string[]): AudioCommandArgs {
    const { audio, voiceChannel, volume, autoDelete } = commandLine(
      this.acceptedArgs,
      {
        argv: args,
        partial: true,
        camelCase: true,
      },
    );

    return {
      audio: audio.join('').toLowerCase(),
      voiceChannel: voiceChannel?.join(' ').toLowerCase(),
      volume: volume && volume > 0 && volume <= 200 ? volume / 100 : 1,
      autoDelete,
    };
  }

  private validateChannel(message: Message, channelArg: string): VoiceChannel {
    const { member, guild } = message;
    let botChannel = member.voice.channel as VoiceChannel;

    if (channelArg) {
      const channelSearch = guild.channels.cache.find(
        ({ name, type }) =>
          name.toLowerCase() === channelArg && type === 'GUILD_VOICE',
      );

      if (!channelSearch) {
        throw new InvalidVoiceChannelException(channelArg);
      }

      botChannel = channelSearch as VoiceChannel;
    }

    if (!botChannel) {
      throw new UserNotInVoiceChannelException();
    }

    return botChannel;
  }

  private playAudio(
    guild: Guild,
    channel: VoiceChannel,
    audioStream: Readable,
    volume: number,
  ): void {
    const voiceConnection = joinVoiceChannel({
      guildId: guild.id,
      channelId: channel.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    const audioResource = createAudioResource(audioStream, {
      inlineVolume: true,
    });

    audioResource.volume.setVolume(volume);

    const audioPlayer = createAudioPlayer();

    voiceConnection.subscribe(audioPlayer);

    audioPlayer.play(audioResource);

    audioPlayer.on(AudioPlayerStatus.Idle, () => voiceConnection.destroy());
  }

  public async execute(message: Message, args: string[]): Promise<void> {
    try {
      args.unshift('-' + commandTrigger);
      const { guild, member } = message;

      const { audio, autoDelete, voiceChannel, volume } = this.parseArgs(args);

      if (autoDelete) {
        message.delete();
      }

      const guildIsLocked = Locker.isLocked(guild);

      if (guildIsLocked) {
        message.channel.send(
          "Sorry, I'm busy or sleeping now, just wait a second and try again",
        );
        return;
      }

      const botChannel = this.validateChannel(message, voiceChannel);

      const sanitizedName = this.audioManager.sanitizeAudioName(audio);

      const audioStream = this.audioManager.stream(guild.id, sanitizedName);

      this.debugger(
        `Playing ${sanitizedName} on ${guild.name}/${botChannel.name} by ${member.user.tag}`,
      );

      return this.playAudio(guild, botChannel, audioStream, volume);
    } catch (ex: unknown) {
      this.debugger(ex);
      let messageText = 'An error has ocurred! Please try again';
      if (
        ex instanceof InvalidVoiceChannelException ||
        ex instanceof UserNotInVoiceChannelException
      ) {
        messageText = ex.message;
      }

      if (ex instanceof InvalidAudioException) {
        messageText =
          ex.message +
          `\nCheck audio list with command \`-${commandTrigger} list\``;
      }

      message.channel.send(messageText);
    }
  }
}
