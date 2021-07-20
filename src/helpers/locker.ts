import { Guild } from "discord.js";
import { autoUnlockTime } from "../config";

const locks = {};
const autoUnlockTimeSeconds = autoUnlockTime * 1000;

const isLocked = ({ id }: Guild) => locks[id];

const lock = (guild: Guild) => {
  const { id } = guild;
  locks[id] = true;

  setTimeout(() => unlock(guild), autoUnlockTimeSeconds);
};

const unlock = ({ id }: Guild) => (locks[id] = false);

export { isLocked, lock, unlock };
