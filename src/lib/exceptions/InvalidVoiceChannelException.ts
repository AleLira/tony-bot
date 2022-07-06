export default class InvalidVoiceChannelException extends Error {
  constructor(channelName: string) {
    super(`Channel ${channelName} not found or is not a voice channel`);
  }
}
