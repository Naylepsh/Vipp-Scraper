import fetch from "node-fetch";
import { writeFile } from "fs/promises";
import { join, resolve } from "path";

export async function downloadFile(url, dest) {
  const res = await fetch(url);
  const buffer = await res.buffer();

  const path = join(resolve(), dest);
  await writeFile(path, buffer);
}
