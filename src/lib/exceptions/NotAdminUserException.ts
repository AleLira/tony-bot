export default class NotAdminUserException extends Error {
  constructor() {
    super(`User is not a server admin`);
  }
}
