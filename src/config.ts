export const commandTrigger = process.env.CONFIG_TRIGGER_CHAR || "t";

export const discordToken = process.env.DISCORD_TOKEN;

export const audiosDir = process.env.CONFIG_AUDIOS_DIR || "audios";

export const autoUnlockTime = (process.env.CONFIG_AUTO_UNLOCK_TIME) ? Number(process.env.CONFIG_AUTO_UNLOCK_TIME) : 3;

