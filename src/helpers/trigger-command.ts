export default function getTriggerRegex() {
  const commandTrigger = process.env.CONFIG_TRIGGER_CHAR || "t";

  return new RegExp(`^\-${commandTrigger}\\s`);
}
