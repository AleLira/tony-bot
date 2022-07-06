export default class UserNotInVoiceChannelException extends Error {
  constructor() {
    super(`User is not in a voice channel`);
  }
}
