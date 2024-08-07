
'use server';

import { CreateTaskSchema } from '@/app/_lib/validations';
import { Color, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import path from 'path';
import fs from 'fs';


export async function generateOrderDetailPdf(orderDetails: CreateTaskSchema): Promise<Uint8Array> {
  console.log('📝 Generating PDF...');

  // Load the PDF template
  const templatePath = path.join(process.cwd(), 'src', 'generator', 'pdf', 'FINAL_WAYBILL_TEMPLATE.pdf');
  const templatePdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templatePdfBytes);

  // Get the first page of the document
  const page = pdfDoc.getPages()[0];

  // Embed the font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Function to draw text
  const drawText = (text: string, x: number, y: number, size: number = 12) => {
    page!.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  const drawRectangle = (x: number, y: number, width: number, height: number, backgroundColor: Color) => {
    page!.drawRectangle({
      x,
      y,
      width,
      height,
      color: backgroundColor,
    });
  };


  drawRectangle(250, 700, 10, 50, rgb(0, 0, 0));

  const pdfBytes = await pdfDoc.save();
  console.log('📝 PDF generated successfully');
  return pdfBytes;
}