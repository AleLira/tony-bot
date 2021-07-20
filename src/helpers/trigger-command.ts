import { commandTrigger } from "../config";

export default function getTriggerRegex() {
  return new RegExp(`^\-${commandTrigger}\\s`);
}
