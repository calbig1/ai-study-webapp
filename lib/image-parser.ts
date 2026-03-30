export async function extractImageAcademicText(fileName: string): Promise<string> {
  // Placeholder OCR pipeline hook: can be replaced with Vision API/OCR service.
  const cleaned = fileName.replace(/[_\-.]/g, " ");
  return `Detected labels and headings from image: ${cleaned}`;
}

export function removeVisualNoise(text: string): string {
  return text
    .split(/\n|\./)
    .map((line) => line.trim())
    .filter((line) => line.length > 8)
    .filter((line) => !/^page\s+\d+/i.test(line))
    .filter((line) => !/copyright|footer|header/i.test(line))
    .join(". ");
}
