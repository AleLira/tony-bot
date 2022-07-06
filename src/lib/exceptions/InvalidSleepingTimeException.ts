export default class InvalidSleepingTimeException extends Error {
  constructor(maxMinutesTime: number) {
    super(
      `Invalid sleeping time. It must be between 1 second and ${maxMinutesTime} minutes`,
    );
  }
}
