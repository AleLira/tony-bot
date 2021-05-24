import commandLine from "command-line-args";
import stringArgv from "string-argv";

interface botOptions {
  audio: string;
  channel?: string;
  volume?: number;
  autoDelete: boolean;
}

const argumentsOptions = (trigger) => [
  { name: "audio", alias: trigger, type: String, multiple: true },
  { name: "channel", alias: "c", type: String, multiple: true },
  { name: "volume", alias: "v", type: Number },
  { name: "autoDelete", alias: "d", type: Boolean },
];

const parseArguments = (content: string, trigger: string): botOptions => {
  const argv = stringArgv(content);
  const { audio, channel, volume, autoDelete } = commandLine(
    argumentsOptions(trigger),
    {
      argv,
    }
  );

  const options = {
    audio: audio?.join("").toLowerCase(),
    channel: channel?.join(" "),
    volume: volume && volume > 0 && volume <= 200 ? volume / 100 : undefined,
    autoDelete,
  };
  return options;
};

export default parseArguments;
