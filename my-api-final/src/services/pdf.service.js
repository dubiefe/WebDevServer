import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generateDeliveryNotePDF = (deliveryNote, options = {}) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    // Streams
    if (options.filePath) {
      const fileStream = fs.createWriteStream(options.filePath);
      doc.pipe(fileStream);

      fileStream.on('finish', () => resolve(options.filePath));
      fileStream.on('error', reject);
    }

    if (options.res) {
      doc.pipe(options.res);
    }

    // Content of the PDF
    doc.fontSize(20).text(`Delivery Note n°${deliveryNote._id}`, { align: 'center' });

    doc.moveDown();
    doc.fontSize(12).text(`Description: ${deliveryNote.description}`);

    doc.moveDown();
    doc.text(`Created by ${deliveryNote.user.name} ${deliveryNote.user.lastname} (${deliveryNote.user.email})`);

    doc.moveDown();
    doc.text(`For project ${deliveryNote.project.name} (${deliveryNote.project.email})`);

    doc.moveDown();
    doc.text(`With client ${deliveryNote.client.name} (${deliveryNote.client.email})`);

    doc.moveDown();

    if (deliveryNote.format === "hours") {
      doc.text(`Hours: ${deliveryNote.hours}`);
    } else {
      doc.text(
        `Material: ${deliveryNote.material} (${deliveryNote.quantity} ${deliveryNote.unit})`
      );
    }

    // Workers
    if (deliveryNote?.workers?.length) {
      doc.moveDown();
      doc.text('Workers:');

      deliveryNote.workers.forEach(w => {
        doc.text(`- ${w.name} (${w.hours}h)`);
      });
    }

    // Signature
    if (deliveryNote.signed) {
      doc.moveDown();
      doc.text(`Signed on: ${new Date(deliveryNote.signedAt).toLocaleDateString()}`);

      if (deliveryNote.signatureData) {
        try {
          doc.image(deliveryNote.signatureData, { width: 150 });
        } catch {
          doc.text('(Signature invalid)');
        }
      }
    }

    doc.end();

    if (!options.filePath) {
      resolve();
    }
  });
};