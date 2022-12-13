import { commandTrigger } from '../config';

export function isCommand(firstMessageFragment: string): boolean {
  return firstMessageFragment === '-' + commandTrigger;
}

export const dynamicImport = new Function(
  'modulePath',
  'return import(modulePath)',
);
