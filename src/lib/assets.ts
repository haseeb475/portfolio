import { existsSync } from "node:fs";
import { join } from "node:path";

/** Build-time check for files the owner drops into /public (e.g. resume.pdf). */
export function publicFileExists(publicPath: string): boolean {
  return existsSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}
