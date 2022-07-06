import Debug from 'debug';
import { Guild } from 'discord.js';

import { autoUnlockTimeSeconds } from '../config';

export default class Locker {
  private static locks: Record<string, boolean> = {};
  private static autoUnlockTimeMilliseconds = autoUnlockTimeSeconds * 1000;
  private static debug = Debug('Locker:');

  public static isLocked({ id }: Guild): boolean {
    return this.locks[id] ?? false;
  }

  public static lock(guild: Guild, timeMs?: number): void {
    const { id, name } = guild;
    const lockTime = timeMs || this.autoUnlockTimeMilliseconds;

    this.debug(`Locking guild ${name} for ${lockTime} milliseconds`);

    this.locks[id] = true;

    setTimeout(() => this.unlock(guild), lockTime);
  }

  public static unlock({ id, name }: Guild): void {
    this.debug(`Unlocking guild ${name}`);
    this.locks[id] = false;
  }
}
