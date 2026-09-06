import jsPDF from "jspdf";

interface ReportData {
  district: string;
  confidence: number;
  vegetationLoss: number;
  affectedArea: number;
  riskScore: number;
  threat: string;
  date: string;
}

export function generateDetectionReport(data: ReportData) {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(5, 150, 105);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("LandGuard AI — Official Detection Report", 14, 18);

  // Body
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);

  let y = 42;

  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, y);

    doc.setFont("helvetica", "normal");
    doc.text(value, 72, y);

    y += 10;
  };

  row("District", data.district);
  row("Threat", data.threat);
  row("Detection Time", data.date);
  row("AI Confidence", `${data.confidence}%`);
  row("Risk Score", `${data.riskScore}/100`);
  row("Vegetation Loss", `${Math.abs(data.vegetationLoss)}%`);
  row("Affected Area", `${data.affectedArea} Ha`);

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("AI Observation", 14, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  doc.text(
    `LandGuard AI identified significant vegetation degradation in ${data.district}. The satellite comparison indicates approximately ${Math.abs(
      data.vegetationLoss
    )}% vegetation reduction affecting ${data.affectedArea} hectares with an AI confidence of ${data.confidence}%.`,
    14,
    y,
    { maxWidth: 180 }
  );

  y += 35;

  doc.setDrawColor(16, 185, 129);
  doc.line(14, y, 195, y);

  y += 12;

  doc.setTextColor(5, 150, 105);
  doc.setFont("helvetica", "bold");

  doc.text("Verified by LandGuard AI • SIH 2026 Prototype", 14, y);

  doc.save(`LandGuard_Report_${data.district}.pdf`);
}