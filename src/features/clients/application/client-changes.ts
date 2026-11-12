import type { Client } from "../domain/client";

export function hasClientDetailsChanged(current: Client, original: Client): boolean {
  const keys = Object.keys(current) as Array<keyof Client>;
  return keys.some((key) => !Object.is(current[key], original[key]));
}
