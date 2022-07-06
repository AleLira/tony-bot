export default class NoAttachmentException extends Error {
  constructor() {
    super(`The message has no attached file`);
  }
}
