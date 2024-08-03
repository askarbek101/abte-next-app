import { CreateTaskSchema } from '@/app/_lib/validations';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateOrderDetailPdf(orderDetails: CreateTaskSchema): Promise<Uint8Array> {
  console.log('📝 Generating PDF...')
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 750]);
  const { width, height } = page.getSize();
  
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  };

  let yPosition = height - 20;

  drawText(`Order Number: ${orderDetails.title}`, 50, yPosition);
  yPosition -= 20;
  drawText(`Order Date: ${orderDetails.status}`, 50, yPosition);
  yPosition -= 20;
  drawText(`Customer Name: ${orderDetails.label}`, 50, yPosition);
  yPosition -= 20;
  drawText(`Customer Address: ${orderDetails.priority}`, 50, yPosition);
  yPosition -= 40;

  drawText('Items:', 50, yPosition);
  yPosition -= 20;
  drawText('Name', 50, yPosition);
  drawText('Quantity', 250, yPosition);
  drawText('Price', 400, yPosition);
  yPosition -= 20;

  const pdfBytes = await pdfDoc.save();
  console.log('📝 PDF generated successfully')
  return pdfBytes;
}