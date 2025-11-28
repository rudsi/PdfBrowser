import fs from "fs";
import path from "path";

/**
 * Fetch all PDF files inside a given folder path
 * @param relativePath folder path relative to project root
 * @returns array of pdf filenames
 */
export function getPdfFiles(relativePath: string): string[] {
  const absolutePath = path.join(process.cwd(), relativePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error("Folder does not exist: " + absolutePath);
  }

  const files = fs.readdirSync(absolutePath);

  return files.filter((file) => file.toLowerCase().endsWith(".pdf"));
}
