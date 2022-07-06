export default class PermissionDeniedException extends Error {
  constructor(command: string) {
    super(`User do not have permission to execute command ${command}`);
  }
}
