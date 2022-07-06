import { HexColorString, Message } from 'discord.js';

import Command from '../Command';

type ColorRange = {
  min: number;
  max: number;
  color: HexColorString;
};

export default class Ping extends Command {
  public readonly aliases = ['ping', 'pong'];
  public readonly description = 'Shows the current ping of the bot';

  public async execute(message: Message): Promise<void> {
    const responseTitle = '🏓 PONG!';

    const pingMessage = await message.channel.send(responseTitle);
    const latency = pingMessage.createdTimestamp - message.createdTimestamp;
    const wsLatency = message.channel.client.ws.ping.toFixed(0);

    const responseMessage = this.createBaseResponseMessage(
      message.author,
      responseTitle,
    );

    responseMessage.setColor(this.searchHex(wsLatency)).addFields(
      {
        name: '📶 API Latency',
        value: `**\`${latency}\`** ms`,
        inline: true,
      },
      {
        name: '🌐 WebSocket Latency',
        value: `**\`${wsLatency}\`** ms`,
        inline: true,
      },
    );

    pingMessage.edit({ content: null, embeds: [responseMessage] });
    return;
  }

  private searchHex(ms: string | number): HexColorString {
    const listColorHex: ColorRange[] = [
      { min: 0, max: 20, color: '#0DFF00' },
      { min: 21, max: 50, color: '#0BC700' },
      { min: 51, max: 100, color: '#E5ED02' },
      { min: 101, max: 150, color: '#FF8C00' },
      { min: 150, max: 200, color: '#FF6A00' },
    ];

    const foundColor = listColorHex.find(
      ({ min, max }) => min <= ms && max >= ms,
    );

    return foundColor?.color ?? '#000';
  }
}
