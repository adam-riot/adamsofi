import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

/**
 * Stamps a tiled diagonal watermark (buyer email + serial) across every page,
 * plus a small footer serial stamp. Deters casual resale/redistribution.
 * Uses email rather than name for the label — buyer names may contain
 * non-Latin characters (zh locale) that the Standard Helvetica font can't encode.
 */
export async function watermarkPdf(
  pdfBytes: Uint8Array,
  info: { buyerEmail: string; serial: string }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const label = `${info.buyerEmail} · ${info.serial}`;
  const fontSize = 10;
  const textWidth = font.widthOfTextAtSize(label, fontSize);
  const stepX = textWidth + 70;
  const stepY = 130;

  for (const page of pdfDoc.getPages()) {
    const { width, height } = page.getSize();
    const cols = Math.ceil(width / stepX) + 2;
    const rows = Math.ceil(height / stepY) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        page.drawText(label, {
          x: c * stepX,
          y: r * stepY,
          size: fontSize,
          font,
          color: rgb(0.6, 0.6, 0.6),
          opacity: 0.16,
          rotate: degrees(35),
        });
      }
    }

    page.drawText(`Salinan peribadi — ${info.serial}`, {
      x: 20, y: 14, size: 7, font, color: rgb(0.45, 0.45, 0.45), opacity: 0.7,
    });
  }

  return pdfDoc.save();
}
