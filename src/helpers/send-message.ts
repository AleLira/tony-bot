import {
  EmbedFieldData,
  MessageEmbed,
  MessageOptions,
  TextChannel,
} from "discord.js";

export type SendMessageOpts = {
  channel: TextChannel;
  content: string;
  title: string;
  type: MessageType;
  fields?: EmbedFieldData[];
};

export type SendMessageByTypeOpts = Omit<SendMessageOpts, "title" | "type"> & {
  title?: string;
};

export enum MessageType {
  ERROR,
  INFO,
}

export enum MessageSidebarColor {
  ERROR = "#ff3300",
  INFO = "#0099ff",
}

const send = async ({
  channel,
  content,
  title,
  type,
  fields,
}: SendMessageOpts) => {
  const errorMsg = new MessageEmbed()
    .setColor(MessageSidebarColor[type])
    .setTitle(title)
    .setDescription(content);

  if (fields) {
    errorMsg.addFields(fields);
  }

  const options: MessageOptions = {
    embed: errorMsg,
  };
  return channel.send(options);
};

const info = async (opts: SendMessageByTypeOpts) =>
  send({ title: "Info", ...opts, type: MessageType.INFO });

const error = async (opts: SendMessageByTypeOpts) =>
  send({ title: "Error", ...opts, type: MessageType.ERROR });

export { send, error, info };
