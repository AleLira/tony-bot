import 'dotenv/config';
import MissingEnvVarException from './lib/exceptions/MissingEnvVarException';

const REQUIRED_VARS = ['DISCORD_TOKEN', 'DISCORD_BOT_OWNER_ID'];

REQUIRED_VARS.forEach((envVar) => {
  const val = process.env[envVar];
  if (val === '' || val === null || val === undefined) {
    throw new MissingEnvVarException(envVar);
  }
});

export const commandTrigger = process.env.CONFIG_TRIGGER_CHAR || 't';

export const botOwnerDiscordId = process.env.DISCORD_BOT_OWNER_ID;

export const discordToken = process.env.DISCORD_TOKEN;

export const botName = process.env.APP_BOT_NAME || 'TonyBot';

export const autoUnlockTimeSeconds = process.env.CONFIG_AUTO_UNLOCK_TIME_SECONDS
  ? Number(process.env.CONFIG_AUTO_UNLOCK_TIME_SECONDS)
  : 3;
