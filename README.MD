# Tony Bot :monkey:

Just a simple Discord bot to play audios on voice channels.

## Features

- Multiserver
- Customizable trigger command
- Concurrency Lock (only one play at a time by server)
- Custom volume
- Send audios for specific voice channel
- Clear messages related to bot
- Add new audios easily without changing code or configuration files
- Audio Upload direct from Discord
- Lock bot to avoid use for some time
- Auto delete messages

# Getting Started

## Environment Variables

### App
- **APP_BOT_NAME:** Your bot name. Will appear in some responses and help messages.

### Discord
- **DISCORD_TOKEN:** Your bot token created at [Discord Developers page](https://discord.com/developers/applications)
- **DISCORD_BOT_OWNER_ID:** Your Discord User ID. Will be used to allow you to run Admin Only commands (**upload** and **sleep**)

### Config
- **CONFIG_TRIGGER_CHAR:** Character used as bot trigger command after "**-**" symbol (default is "**t**")
- **CONFIG_AUTO_UNLOCK_TIME_SECONDS:** Time in seconds to automatically unlock the bot on a server if an error occurs while playing audio (default is "**3**")

### Debug

As used by [Debug Package](https://github.com/debug-js/debug#environment-variables)

## Using app

### Starting Typescript

```bash
yarn start:dev
```

> will reload app at every file save

### Build TS Code:

```bash
yarn build
```

JS built code will be available at `dist` directory

### Starting built app

With yarn:
```bash
yarn start
```

With node:

```bash
node dist/app.js
```

With PM2:

```bash
pm2 start dist/app.js --name tony-bot
```

### Lint

Lint check:
```bash
yarn lint
```

Lint check & fix:
```bash
yarn lint:fix
```

# Managing the application

## Adding, updating and removing audios

just add, rename or remove audios directly in your **audios** directory and restart the app.

All audios under **audios/originals** directory will be available on all Discord Servers your bot is on

Audios under **audios/{SERVER_ID}** will be available only on the specified server

## Help Commands

### help

Send `-t help` to see a list with all commands.

Send `-t help <command-name>` to see help info about an specific command, including aliases and params details.

Example:

```
```

### ping

Bot should answer with a "Pong" message.

Example:

```
-t ping
```

### list

You'll receive a list with all available audios.

Example:

```
-t list
```

## Cleaning messages

You can clear all messages related to bot (commands to bot and bot messages).

Just send the **clear** command.

Example:

```
-t clear
```

## Play Audios

Audios can be played with the command:

```
<trigger> <audio-name> <options>
```

Simple Example:

```
-t aopa
```

### Audio options

#### Channel

You can send the audio to a specific channel with **-c** option
Simple Example:

```
-t aopa -c General
```

> Channel option is case-insensitive

#### Volume

You can play the audio with a specific volume with **-v** option
Simple Example:

```
-t aopa -v 150
```

> Volume should be between 0 and 200 (Default is **100**)

#### Auto Delete

Mark a message to auto delete with **-d** option.
After playing the audio, the trigger message will be automatically deleted
Simple Example:

```
-t aopa -d
```

## Upload new Audios from Discord

> Only bot owner and Server Admins can use this command.

Just send a message with an attached audio file and the **upload** command

Simple Example:

```
-t upload
```

Audio name will be the file name.

You can also send the audio name as a param in the message. Example:

```
-t upload audio name here
```

In both cases, all uppercase letters will turn to lowercase, spaces and special chars will be removed and accented characters will be replaced by their unaccented versions.

Example:

`Sem Condições @#!` will turn to `semcondicoes`

On first upload, the Server specific audios directory will be automatically created under `audios` directory.

## Put the bot to sleep

> Only bot owner and Server Admins can use this command.

Lock the bot for the specified time with `sleep` command (Default is 15 seconds).

Example:
```
-t sleep <time>
```

Allowed sleeping time is between 1 second and 5 minutes. Time param format is:

`11` or `11s` for seconds (between 1 and 300)

`1m` for minutes (between and 5)