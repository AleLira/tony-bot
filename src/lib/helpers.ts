import { commandTrigger } from '../config';

export function isCommand(firstMessageFragment: string): boolean {
  return firstMessageFragment === '-' + commandTrigger;
}
