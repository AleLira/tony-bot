import { Message, TextChannel } from 'discord.js';

import Command from '../Command';
import InvalidSleepingTimeException from '../exceptions/InvalidSleepingTimeException';
import InvalidSleepingTimeStringException from '../exceptions/InvalidSleepingTimeStringException';
import Locker from '../Locker';

enum TimeUnits {
  Seconds = 'seconds',
  Minutes = 'minutes',
}

type IntervalTime = {
  time: number;
  unit: TimeUnits;
};

export default class Sleep extends Command {
  public readonly aliases = ['sleep', 'lock'];
  public readonly description =
    'Lock the bot for the specified time in seconds. Only Bot Owner and Server Admin can use this command';
  public readonly acceptedArgs = [
    {
      name: 'time',
      description: 'Time in seconds to lock bot (default is 15)',
      isRequired: false,
      type: Number,
    },
  ];

  private readonly generalFormatRegex = /^\d{1,3}(m|s)?$/gi;
  private readonly onlyNumbersRegex = /^\d{1,3}$/gi;
  private readonly extractNumbersRegex = /^\d{1,3}/gi;
  private readonly secondsRegex = /^\d{2}s$/gi;
  private readonly maxSleepingMinutes = 5;
  private readonly secondsInAMinute = 60;
  private readonly millisecondsInASecond = 1000;

  private parseTimeString(time: string): IntervalTime {
    if (!time.match(this.generalFormatRegex)) {
      throw new InvalidSleepingTimeStringException();
    }

    if (time.match(this.onlyNumbersRegex)) {
      return { time: Number(time), unit: TimeUnits.Seconds };
    }

    return {
      time: this.extractNumber(time),
      unit: time.match(this.secondsRegex)
        ? TimeUnits.Seconds
        : TimeUnits.Minutes,
    };
  }

  private validateTime({ time, unit }: IntervalTime): boolean {
    const timeMinorThanOne = time < 1;

    if (timeMinorThanOne) {
      return false;
    }

    if (unit === TimeUnits.Minutes) {
      return time <= this.maxSleepingMinutes;
    }

    const maxSleepingSeconds = this.maxSleepingMinutes * this.secondsInAMinute;
    return time <= maxSleepingSeconds;
  }

  private timeToMilliseconds({ time, unit }: IntervalTime): number {
    const milliseconds = time * this.millisecondsInASecond;

    if (unit === TimeUnits.Seconds) {
      return milliseconds;
    }

    return milliseconds * this.secondsInAMinute;
  }

  private extractNumber(time: string): number {
    const extractedTime = time.match(this.extractNumbersRegex)[0];

    return Number(extractedTime);
  }

  public async execute(message: Message, args: string[]): Promise<void> {
    const { member, channel, guild } = message;

    const userHasPermissions = this.userIsAdmin(member, channel as TextChannel);

    if (!userHasPermissions) {
      const responseTitle = 'Permission Denied';
      const responseDescription =
        "You don't have permission to execute this command, only Bot Owner and Server Admins can lock the bot";
      const responseMessage = this.createBaseResponseMessage(
        message.author,
        responseTitle,
        responseDescription,
      );

      message.reply({ embeds: [responseMessage] });

      return;
    }

    const guildIsLocked = Locker.isLocked(guild);

    if (guildIsLocked) {
      const responseMessage = this.createBaseResponseMessage(
        message.author,
        "I'm already sleeping",
      );

      message.reply({ embeds: [responseMessage] });
      return;
    }

    try {
      const timeArg = args[0] ?? '15';
      const parsedTime = this.parseTimeString(timeArg);

      if (!this.validateTime(parsedTime)) {
        throw new InvalidSleepingTimeException(this.maxSleepingMinutes);
      }

      const timeMs = this.timeToMilliseconds(parsedTime);

      Locker.lock(guild, timeMs);

      const responseTitle = "I'm going to sleep 😴";
      const responseDescription = `I'm not playing any audio for the next ${parsedTime.time} ${parsedTime.unit}`;

      const responseMessage = this.createBaseResponseMessage(
        message.author,
        responseTitle,
        responseDescription,
      );

      message.channel.send({ embeds: [responseMessage] });
    } catch (ex) {
      let messageText = 'An error has ocurred. Please try again';
      if (ex instanceof InvalidSleepingTimeStringException) {
        messageText = ex.message.replace(/\'/g, '`');
      }

      if (ex instanceof InvalidSleepingTimeException) {
        messageText = ex.message;
      }

      message.reply(messageText);
      return;
    }
  }
}
