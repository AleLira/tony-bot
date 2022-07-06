export default class InvalidSleepingTimeStringException extends Error {
  constructor() {
    super(
      `Invalid sleeping time. You must follow the format '11' or '11s' for seconds or '11m' for minutes`,
    );
  }
}
