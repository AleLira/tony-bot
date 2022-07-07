import Debug from 'debug';
import { Message } from 'discord.js';
import { readdirSync } from 'fs';
import { resolve } from 'path';

import Command from './Command';
import InvalidCommandException from './exceptions/InvalidCommandException';

export type CommandMetadata = { name: string } & Omit<Command, 'execute'>;

export default class CommandManager {
  private commands: Command[] = [];
  private aliasesMap: Record<string, Command> = {};
  private commandsPath = resolve(__dirname, 'commands');
  private debug = Debug('CommandManager:');
  private static instance: CommandManager;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): CommandManager {
    if (!this.instance) {
      this.instance = new CommandManager();
    }

    return this.instance;
  }

  public async load(): Promise<void> {
    const files = readdirSync(this.commandsPath);

    await Promise.all(
      files.map(async (file) => {
        if (!file.match(/[^.d].(ts|js)$/i)) {
          this.debug(`[WARN] File ${file} is not a JS or TS file. Ignoring...`);
          return;
        }
        const command = await import(resolve(this.commandsPath, file));

        const commandInstance: Command = new command.default();

        this.register(commandInstance);
      }),
    );
  }

  private register(command: Command): void {
    this.commands.push(command);

    for (const alias of command.aliases) {
      if (!alias) {
        continue;
      }

      if (this.aliasesMap[alias]) {
        this.debug(
          `[WARN] ${alias} is already an alias of ${this.aliasesMap[alias].constructor.name}`,
        );
        continue;
      }

      this.aliasesMap[alias] = command;
    }

    this.debug(`Command ${command.constructor.name} registered`);
  }

  public run(
    command: string,
    message: Message,
    args?: string[],
  ): Promise<void> | void {
    const commandHandler = this.aliasesMap[command];

    if (!commandHandler) {
      message.reply({ content: `${command} is an invalid command 🙃` });
      return;
    }

    return commandHandler.execute(message, args);
  }

  public allAliases(): string[] {
    return Object.keys(this.aliasesMap);
  }

  public exists(command: string): boolean {
    return this.allAliases().includes(command);
  }

  public commandMetadata(commandAlias: string): CommandMetadata {
    const command = this.aliasesMap[commandAlias];

    if (!command) {
      throw new InvalidCommandException(commandAlias);
    }

    return {
      name: command.constructor.name,
      aliases: command.aliases,
      description: command.description,
      acceptedArgs: command.acceptedArgs,
    };
  }
}
