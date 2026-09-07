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
  const doc = new jsPDF("portrait", "mm", "a4");

  // ================= COLORS =================
  const emerald: [number, number, number] = [16, 185, 129];

  const navy: [number, number, number] = [5, 15, 35];
  const dark: [number, number, number] = [15, 23, 42];
  const slate: [number, number, number] = [100, 116, 139];
 
  const softGray: [number, number, number] = [236, 241, 246];

  // Risk badge colors
  const riskColor =
    data.riskScore >= 85
      ? [220, 38, 38]
      : data.riskScore >= 70
      ? [245, 158, 11]
      : [34, 197, 94];

  const badgeText =
    data.riskScore >= 85
      ? "CRITICAL ALERT"
      : data.riskScore >= 70
      ? "HIGH RISK"
      : "MEDIUM RISK";

  // ================= PAGE BORDER =================
  doc.setDrawColor(...emerald);
  doc.setLineWidth(0.6);
  doc.rect(5, 5, 200, 287);

  // Top Intelligence Strip
  doc.setFillColor(...emerald);
  doc.rect(0, 0, 210, 2, "F");

  // ================= HEADER =================
  doc.setFillColor(...navy);
  doc.rect(0, 2, 210, 36, "F");

  // Shield Logo
  doc.setDrawColor(...emerald);
  doc.setFillColor(8, 20, 38);
  doc.circle(18, 20, 8, "FD");

  doc.setTextColor(...emerald);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("LG", 14.7, 22);

  // Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("LandGuard AI", 30, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("Government of West Bengal • Directorate of Forests", 30, 21);
  doc.text("Satellite Intelligence & Land Monitoring Prototype • SIH 2026", 30, 26);

  // Green Badge
  doc.setFillColor(...emerald);
  doc.roundedRect(145, 10, 50, 10, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("AI DETECTION DOSSIER", 149, 16.2);

  // ================= TITLE =================
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Official Satellite Encroachment Report", 14, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...slate);
  doc.text(
    `Generated on ${data.date} using Sentinel-2 AI Change Detection Pipeline`,
    14,
    56
  );

  // ================= ALERT BADGE =================
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(14, 62, 48, 9, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(badgeText, 18, 68);

  // ================= SUMMARY CARD =================
  doc.setFillColor(...softGray);
  doc.roundedRect(14, 76, 182, 56, 3, 3, "F");

  // Divider
  doc.setDrawColor(...emerald);
  doc.setLineWidth(0.3);
  doc.line(105, 80, 105, 126);

  // LEFT
  const left = [
    ["District", data.district],
    ["AI Confidence", `${data.confidence}%`],
    ["Risk Score", `${data.riskScore}/100`],
    ["Threat Level", data.threat],
  ];

  left.forEach((row, i) => {
    const y = 88 + i * 10;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...slate);
    doc.text(row[0], 20, y);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text(row[1], 60, y);
  });

  // RIGHT
  const right = [
    ["Vegetation Loss", `${Math.abs(data.vegetationLoss)}%`],
    ["Affected Area", `${data.affectedArea} Ha`],
    ["Detection Time", data.date],
    ["Satellite Source", "Sentinel-2B + Landsat-9"],
  ];

  right.forEach((row, i) => {
    const y = 88 + i * 10;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...slate);
    doc.text(row[0], 112, y);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text(row[1], 152, y);
  });

  // ================= OBSERVATION =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...dark);
  doc.text("AI Observation Summary", 14, 142);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const observation =
    `LandGuard AI detected abnormal land-cover change inside ${data.district}. Multi-temporal Sentinel-2 comparison identified approximately ${Math.abs(
      data.vegetationLoss
    )}% vegetation degradation affecting ${data.affectedArea} hectares. The AI engine generated ${data.confidence}% confidence with an environmental risk score of ${data.riskScore}/100. This area has been automatically flagged for priority field verification before administrative action.`;

  const wrappedObservation = doc.splitTextToSize(observation, 182);
  doc.text(wrappedObservation, 14, 150);

  // ================= RISK METER =================
  const meterY = 182;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("AI Environmental Risk Meter", 14, meterY);

  doc.setFillColor(226, 232, 240);
  doc.roundedRect(14, meterY + 6, 150, 6, 3, 3, "F");

  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(
    14,
    meterY + 6,
    (150 * data.riskScore) / 100,
    6,
    3,
    3,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...dark);
  doc.text(`${data.riskScore}/100`, 170, meterY + 11);

  // ================= RECOMMENDATIONS =================
  const recY = 200;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Recommended Government Actions", 14, recY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.8);

  const recommendations = [
    "Immediate field verification by Divisional Forest Officer (DFO).",
    "Cross-check cadastral boundary against latest GIS polygon layer.",
    "Issue encroachment notice if unauthorized land conversion is confirmed.",
    "Schedule follow-up Sentinel-2 comparison within the next orbital cycle.",
  ];

  recommendations.forEach((item, i) => {
    const y = recY + 10 + i * 9;

    doc.setFillColor(...emerald);
    doc.circle(18, y - 1, 1.1, "F");

    doc.setTextColor(...dark);
    doc.text(item, 24, y);
  });

  // ================= CLASSIFICATION BOX =================
  doc.setFillColor(8, 20, 38);
  doc.roundedRect(14, 245, 182, 18, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...emerald);
  doc.text("SATELLITE INTELLIGENCE CLASSIFICATION", 18, 253);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 220, 220);
  doc.text(
    "Prototype Government AI Environmental Monitoring Report • SIH 2026",
    18,
    259
  );

  // ================= FOOTER =================
  doc.setDrawColor(...emerald);
  doc.setLineWidth(0.5);
  doc.line(14, 270, 196, 270);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...emerald);
  doc.text("VERIFIED BY LANDGUARD AI", 14, 278);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...slate);
  doc.text(
    "Government of West Bengal • Directorate of Forests • Smart India Hackathon 2026",
    14,
    284
  );
  doc.text(
    "Generated using AI Satellite Change Detection Pipeline (Prototype Version)",
    14,
    289
  );

  // ================= SAVE =================
  doc.save(`LandGuardAI_${data.district.replace(/\s+/g, "_")}_Report.pdf`);
}