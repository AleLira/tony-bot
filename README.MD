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

# Getting Started

StackEdit stores your files in your browser, which means all your files are automatically saved locally and are accessible **offline!**

## Environment Variables

- **DISCORD_TOKEN:** Your bot token created at [Discord Developers page](https://discord.com/developers/applications)
- **CONFIG_AUDIOS_DIR:** Directory with audio files, relative to application root dir (defaut is "_audios_")
- **CONFIG_TRIGGER_CHAR:** Character used as bot trigger command after "_-_" symbol (default is "_t_")
- **CONFIG_AUTO_UNLOCK_TIME:** Time in seconds to automatically unlock the bot on a server if an error occurs while playing audio (default is "_3_")

## Starting app

### Starting Typescript

With nodemon:

```bash
yarn nodemon src/app.ts
```

With ts-node:

```bash
yarn ts-node src/app.ts
```

### Transpile to JS:

```bash
yarn build
```

Transpiled code will be available at `dist` directory

### Starting transpiled app

With node:

```bash
node dist/app.js
```

With nodemon:

```bash
yarn nodemon dist/app.js
```

With PM2:

```bash
pm2 start dist/app.js --name tony-bot
```

# Managing the application

## Adding, updating and removing audios

just add, rename or remove audios directly in your _audios_ directory.

The app will automatically update the available audios list.

## Help Commands

### help

You'll receive this list with all available commands

Example:

```
-t help
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

## Send Audios

Audios can be sent with the command:

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
-t aopa -c mesa de pulse
```

> Channel option is case-insensitive

#### Volume

You can play the audio with a specific volume with **-v** option
Simple Example:

```
-t aopa -v 150
```

> Volume should be between 0 and 200 (Default is **100**)
