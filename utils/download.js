import fetch from "node-fetch";
import { writeFile } from "fs/promises";

export async function downloadFile(url, dest) {
  const res = await fetch(url);
  const buffer = await res.buffer();

  await writeFile(dest, buffer);
}
