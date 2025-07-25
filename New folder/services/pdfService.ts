
// This assumes jspdf and html2canvas are loaded from a CDN
declare const jspdf: any;
declare const html2canvas: any;

export const generatePdf = (elementId: string): void => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id "${elementId}" not found.`);
    alert("Could not find content to generate PDF.");
    return;
  }

  const { jsPDF } = jspdf;

  html2canvas(input, {
    scale: 2, // Higher scale for better quality
    useCORS: true, 
  }).then((canvas: HTMLCanvasElement) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(`Family_Budget_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  }).catch((error: any) => {
    console.error("Error generating PDF:", error);
    alert("An error occurred while generating the PDF. See console for details.");
  });
};
