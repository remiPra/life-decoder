import { jsPDF } from 'jspdf';

// Fonction pour wrapper le texte
function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length * 2.5 > maxWidth) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

export function exportRationalAnalysisToPDF(result: any) {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;
  const pageWidth = 190;

  // Titre
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LIFE DECODER', 105, yPos, { align: 'center' });

  yPos += 10;
  doc.setFontSize(12);
  doc.text('Analyse de Décision', 105, yPos, { align: 'center' });

  yPos += 15;

  // Situation
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Situation', 10, yPos);
  yPos += lineHeight;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const situationLines = wrapText(result.situationActuelle || '', pageWidth);
  situationLines.forEach(line => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 10, yPos);
    yPos += lineHeight;
  });

  yPos += 5;

  // Timing
  if (result.timing) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Timing Optimal', 10, yPos);
    yPos += lineHeight;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const timingLines = wrapText(result.timing, pageWidth);
    timingLines.forEach(line => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 10, yPos);
      yPos += lineHeight;
    });
    yPos += 5;
  }

  // Scénarios
  if (result.scenarios && result.scenarios.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Scénarios', 10, yPos);
    yPos += lineHeight;

    result.scenarios.forEach((scenario: any, index: number) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${scenario.titre}`, 10, yPos);
      yPos += lineHeight;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const scenarioLines = wrapText(scenario.description, pageWidth - 10);
      scenarioLines.forEach(line => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 15, yPos);
        yPos += lineHeight;
      });
      yPos += 3;
    });
    yPos += 5;
  }

  // Actions
  if (result.actions && result.actions.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Actions Recommandées', 10, yPos);
    yPos += lineHeight;

    result.actions.forEach((action: any) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const actionLines = wrapText(`• ${action.action}`, pageWidth - 10);
      actionLines.forEach(line => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 15, yPos);
        yPos += lineHeight;
      });
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 290, { align: 'center' });

  // Télécharger
  doc.save(`life-decoder-analyse-${Date.now()}.pdf`);
}

export function exportMysticalAnalysisToPDF(analysis: string, profile?: any) {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;
  const pageWidth = 190;

  // Titre
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LIFE DECODER', 105, yPos, { align: 'center' });

  yPos += 10;
  doc.setFontSize(12);
  doc.text('Architecture de la Destinée', 105, yPos, { align: 'center' });

  yPos += 15;

  // Profil numérologique si disponible
  if (profile) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Profil Numérologique', 10, yPos);
    yPos += lineHeight;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Chemin de vie: ${profile.lifePath}`, 10, yPos);
    yPos += lineHeight;
    doc.text(`Désir de l'âme: ${profile.soulUrge}`, 10, yPos);
    yPos += lineHeight;
    doc.text(`Expression: ${profile.expression}`, 10, yPos);
    yPos += lineHeight;
    doc.text(`Personnalité: ${profile.personality}`, 10, yPos);
    yPos += lineHeight + 5;
  }

  // Analyse
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Analyse', 10, yPos);
  yPos += lineHeight;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const analysisLines = wrapText(analysis, pageWidth);
  analysisLines.forEach(line => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 10, yPos);
    yPos += lineHeight;
  });

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 290, { align: 'center' });

  // Télécharger
  doc.save(`life-decoder-mystique-${Date.now()}.pdf`);
}
