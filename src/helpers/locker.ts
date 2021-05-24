import { Guild } from "discord.js";

const locks = {};

const autoUnlockTimeEnv = Number(process.env.CONFIG_AUTO_UNLOCK_TIME);
const autoUnlockTime = (autoUnlockTimeEnv || 3) * 1000;

const isLocked = ({ id }: Guild) => locks[id];

const lock = (guild: Guild) => {
  const { id } = guild;
  locks[id] = true;

  setTimeout(() => unlock(guild), autoUnlockTime);
};

const unlock = ({ id }: Guild) => (locks[id] = false);

export { isLocked, lock, unlock };
