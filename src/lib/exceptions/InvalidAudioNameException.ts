export default class InvalidAudioNameException extends Error {
  public audioName: string;
  constructor(audioName: string, message?: string) {
    const errorMessage =
      message ||
      `'${audioName}' is an invalid audioName. Only letters and numbers are allowed`;
    super(errorMessage);

    this.audioName = audioName;
  }
}
