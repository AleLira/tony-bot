import { readdirSync } from "fs";
import { watch } from "chokidar";
import * as helpCommands from "./help-commands";

const audiosDir = process.env.CONFIG_AUDIOS_DIR || "audios";

const helpCommandsList = Object.keys(helpCommands);

let audios = loadPaths();

const watcher = watch(`${audiosDir}/`);

setTimeout(() => watcher.on("all", () => (audios = loadPaths())), 1000);

function loadPaths() {
  return readdirSync(audiosDir).reduce((acc, file) => {
    const [filename] = file.split(".");
    if (helpCommandsList.includes(filename)) {
      console.warn(
        "\x1b[33m",
        `"${filename}" is a help command and cannot be used as audio name. Ignoring...`,
        "\x1b[0m"
      );
      return acc;
    }
    acc[filename] = `${audiosDir}/${file}`;
    return acc;
  }, {});
}

function list() {
  return Object.keys(audios);
}

function path(audio: string) {
  return audios[audio];
}

export { list, path };
