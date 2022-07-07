import Debug from 'debug';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from 'fs';
import { resolve } from 'path';
import { Readable } from 'stream';

import CommandManager from './CommandManager';
import InvalidAudioException from './exceptions/InvalidAudioException';

export default class AudioManager {
  private commandAliases: string[] = CommandManager.getInstance().allAliases();
  private audiosDir = resolve('audios');
  private debug = Debug('AudioManager:');
  private audios: Record<string, Record<string, string>> = {};
  private static instance: AudioManager;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): AudioManager {
    if (!this.instance) {
      this.instance = new AudioManager();
    }

    return AudioManager.instance;
  }

  public load(): void {
    this.debug('Reading audios dir');
    const audioDirectories = readdirSync(this.audiosDir, {
      withFileTypes: true,
    });

    audioDirectories.forEach((directory) => {
      if (directory.isDirectory()) {
        this.loadGuildAudios(directory.name);
      }
    });
  }

  public guildAudios(
    guildId: string,
    includeOriginals = true,
  ): Record<string, string> {
    if (includeOriginals) {
      return { ...this.audios['originals'], ...this.audios[guildId] };
    }

    return { ...this.audios[guildId] };
  }

  private path(guildId: string, audioName: string): string {
    const guildAudios = this.guildAudios(guildId);

    const audioPath = guildAudios[audioName];

    if (!audioPath) {
      throw new InvalidAudioException(audioName);
    }

    return audioPath;
  }

  public stream(guildId: string, audioName: string): Readable {
    const path = this.path(guildId, audioName);
    return createReadStream(path);
  }

  public sanitizeAudioName(audioName: string): string {
    let normalized = audioName.normalize('NFD');
    normalized = normalized.replace(/\p{Diacritic}/gu, '');
    normalized = normalized.replace(/[^A-Z0-9]+/gi, '');
    return normalized.toLowerCase();
  }

  private loadGuildAudios(guildId: string): void {
    this.debug(`Reading audios for guild ${guildId}`);

    const files = readdirSync(resolve(this.audiosDir, guildId), {
      withFileTypes: true,
    });

    files.forEach((file) => {
      this.register(guildId, file.name);
    });
  }

  private register(guildId: string, file: string): void {
    const fileNameArr = file.split('.');
    fileNameArr.pop();
    const filename = fileNameArr.join('');

    const audioName = this.sanitizeAudioName(filename);

    if (this.commandAliases.includes(audioName)) {
      this.debug(
        `[WARN] ${audioName} is a bot command and cannot be used as audio name. Ignoring...`,
      );
      return;
    }

    if (!this.audios[guildId]) {
      this.audios[guildId] = {};
    }

    this.audios[guildId][audioName] = resolve(this.audiosDir, guildId, file);

    this.debug(`Audio ${audioName} registered for Guild ${guildId}`);
  }

  public existsInGuild(guildId: string, audioName: string): boolean {
    const sanitizedName = this.sanitizeAudioName(audioName);
    const audios = Object.keys(this.guildAudios(guildId, true));
    return audios.includes(sanitizedName);
  }

  private assertGuildDir(guildId: string): void {
    const path = resolve(this.audiosDir, guildId);

    if (!existsSync(path)) {
      mkdirSync(path);
    }
  }

  public saveAndRegister(
    guildId: string,
    fileName: string,
    file: Buffer,
  ): string {
    const filePath = resolve(this.audiosDir, guildId, fileName);

    this.assertGuildDir(guildId);

    writeFileSync(filePath, file);
    this.register(guildId, fileName);
    return;
  }
}
