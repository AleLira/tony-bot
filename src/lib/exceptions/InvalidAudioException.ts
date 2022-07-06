export default class InvalidAudioException extends Error {
  constructor(audioName: string) {
    super(`${audioName} is not a valid audio name.`);
  }
}
