export default class MissingEnvVarException extends Error {
  constructor(public varName: string) {
    super(`Missing Environment Variable ${varName}`);
  }
}
