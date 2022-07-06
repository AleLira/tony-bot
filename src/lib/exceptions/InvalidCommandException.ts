export default class InvalidCommandException extends Error {
  constructor(commandAlias: string) {
    super(`${commandAlias} is an invalid command`);
  }
}
