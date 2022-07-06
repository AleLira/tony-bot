export default class FileNotAudioException extends Error {
  constructor() {
    super(`The file is not an audio`);
  }
}
