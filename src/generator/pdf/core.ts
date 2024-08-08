
'use server';

import { CreateTaskSchema } from '@/app/_lib/validations';
import { Color, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import path from 'path';
import fs from 'fs';
import { CreateTask, Task } from '@/types/core';


export async function generateOrderDetailPdf(orderDetails: Task): Promise<Uint8Array> {
  console.log('📝 Generating PDF...');

  // Load the PDF template
  const templatePath = path.join(process.cwd(), 'src', 'generator', 'pdf', '12333.pdf');
  const templatePdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templatePdfBytes);


  // find all text fields in the pdf
  const form = pdfDoc.getForm()
  const fields = [
    'RECIPIENT_ADDRESS', 'WAYBILL_NUMBER', 'GENERATED_DATE_af_date', 
    'SENDER_NAME', 'SENDER_ADDRESS', 'SENDER_PHONE_NUMBER', 
    'RECIPIENT_PHONE_NUMBER', 'PAYER_NAME', 'PAYER_ADDRESS', 
    'PAYER_PHONE_NUMBER', 'PAYER_BIN', 'VALUE_OF_GOODS', 
    'INSURANCE_COST', 'NUMBER_OF_PACKAGES', 'VOLUME', 
    'WEIGHT', 'FROM', 'TO', 'RECIPIENT_NAME', 'ABTE-ID'
  ];

  fields.forEach(field => {
    const textField = form.getTextField(field);
    textField.setText(getFieldValueFromOrder(orderDetails, field));
  });
  // Flatten the form to make it uneditable
  form.flatten();

  // Additional step to ensure the PDF is not easily editable
  pdfDoc.setCreationDate(new Date());

  const pdfBytes = await pdfDoc.save();
  console.log('📝 PDF generated successfully');
  return pdfBytes;
}

function getFieldValueFromOrder(order: Task, field: string) {
  switch (field) {
    case 'RECIPIENT_ADDRESS':
      return order.recipient.address;
    case 'WAYBILL_NUMBER':
      return order.id;
    case 'GENERATED_DATE_af_date':
      return order.createdAt.toLocaleDateString();
    case 'SENDER_NAME':
      return order.sender.name;
    case 'SENDER_ADDRESS':
      return order.sender.address;
    case 'SENDER_PHONE_NUMBER':
      return order.sender.phone;
    case 'RECIPIENT_PHONE_NUMBER':
      return order.recipient.phone;
    case 'RECIPIENT_NAME':
      return order.recipient.name;
    case 'PAYER_NAME':
      return order.payer.name;
    case 'PAYER_ADDRESS':
      return order.payer.address;
    case 'PAYER_PHONE_NUMBER':
      return order.payer.phone;
    case 'PAYER_BIN':
      return order.payer.bin;
    case 'ABTE-ID':
      return order.payer.abte_id;
    case 'VALUE_OF_GOODS':
      return order.value_of_goods.toString();
    case 'INSURANCE_COST':
      return order.insurance_cost.toString();
    case 'NUMBER_OF_PACKAGES':
      return order.number_of_packages.toString();
    case 'VOLUME':
      return order.volume?.toString() || '';
    case 'WEIGHT':
      return order.weight?.toString() || '';
    case 'FROM':
      return order.from.name;
    case 'TO':
      return order.to.name;
    default:
      return '';
  }

}