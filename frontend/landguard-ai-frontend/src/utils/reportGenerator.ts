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

  // ---------------- COLORS ----------------
  const emerald: [number, number, number] = [16, 185, 129];
  const dark: [number, number, number] = [15, 23, 42];
  const lightGray: [number, number, number] = [241, 245, 249];
  const gray: [number, number, number] = [100, 116, 139];

  // ---------------- HEADER ----------------
  doc.setFillColor(...dark);
  doc.rect(0, 0, 210, 38, "F");

  // Logo Circle
  doc.setDrawColor(...emerald);
  doc.setLineWidth(0.6);
  doc.circle(20, 19, 8);

  doc.setTextColor(...emerald);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("LG", 16.5, 21);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("LandGuard AI", 34, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Government of West Bengal • Directorate of Forests", 34, 21);
  doc.text("Smart India Hackathon 2026 — Satellite Intelligence Prototype", 34, 26);

  // Classification Badge
  doc.setFillColor(...emerald);
  doc.roundedRect(142, 10, 54, 10, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("AI DETECTION DOSSIER", 147, 16.5);

  // ---------------- TITLE ----------------
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("Official Satellite Encroachment Report", 14, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.text(
    `Generated on ${data.date} using Sentinel-2 AI Change Detection Pipeline`,
    14,
    57
  );

  // ---------------- THREAT BADGE ----------------
  const riskColor =
    data.riskScore >= 85
      ? [220, 38, 38]
      : data.riskScore >= 70
        ? [245, 158, 11]
        : [34, 197, 94];

  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(14, 63, 50, 9, 2, 2, "F");

  const badgeText =
    data.riskScore >= 85
      ? "CRITICAL ALERT"
      : data.riskScore >= 70
        ? "HIGH RISK"
        : "MEDIUM RISK";

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(badgeText, 18, 69);

  // ---------------- SUMMARY TABLE ----------------
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, 78, 182, 52, 3, 3, "F");

  doc.setDrawColor(...emerald);
  doc.setLineWidth(0.4);
  doc.line(105, 82, 105, 126);

  const rows = [
    ["District", data.district],
    ["AI Confidence", `${data.confidence}%`],
    ["Risk Score", `${data.riskScore}/100`],
    ["Threat Level", data.threat],
    ["Vegetation Loss", `${Math.abs(data.vegetationLoss)}%`],
    ["Affected Area", `${data.affectedArea} Ha`],
    ["Detection Time", data.date],
    ["Satellite Source", "Sentinel-2B + Landsat-9"],
  ];

  // Left Side
  rows.slice(0, 4).forEach((row, i) => {
    const y = 88 + i * 10;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text(row[0], 20, y);

    doc.setFont("helvetica", "normal");
    doc.text(row[1], 60, y);
  });

  // Right Side
  rows.slice(4).forEach((row, i) => {
    const y = 88 + i * 10;

    doc.setFont("helvetica", "bold");
    doc.text(row[0], 112, y);

    doc.setFont("helvetica", "normal");
    doc.text(row[1], 152, y);
  });

  // ---------------- AI OBSERVATION ----------------
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("AI Observation Summary", 14, 142);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const observation =
    `LandGuard AI detected abnormal land-cover change inside ${data.district}. ` +
    `Multi-temporal Sentinel-2 comparison identified approximately ${Math.abs(
      data.vegetationLoss
    )}% vegetation degradation affecting ${data.affectedArea} hectares. ` +
    `The AI engine generated ${data.confidence}% confidence with an environmental risk score of ${data.riskScore}/100. ` +
    `This area has been automatically flagged for priority verification by the Forest & Land Department before administrative action.`;

  const wrappedObservation = doc.splitTextToSize(observation, 182);
  doc.text(wrappedObservation, 14, 150);

  // ---------------- AI RISK METER ----------------
  const meterY = 176;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("AI Environmental Risk Meter", 14, meterY);

  // Background Bar
  doc.setFillColor(229, 231, 235);
  doc.roundedRect(14, meterY + 6, 150, 6, 3, 3, "F");

  // Filled Bar
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

  // ---------------- RECOMMENDATIONS ----------------
  const recY = 192;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Recommended Government Actions", 14, recY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const recommendations = [
    "Immediate field verification by Divisional Forest Officer (DFO).",
    "Cross-check cadastral boundary against latest GIS polygon layer.",
    "Issue encroachment notice if unauthorized land conversion is confirmed.",
    "Schedule follow-up Sentinel-2 comparison within the next orbital cycle.",
  ];

  recommendations.forEach((item, i) => {
    const yy = recY + 10 + i * 9;

    doc.setFillColor(...emerald);
    doc.circle(18, yy - 1, 1.1, "F");

    doc.setTextColor(...dark);
    doc.text(item, 24, yy);
  });
  // ---------------- WATERMARK (Background) ----------------
  // doc.saveGraphicsState();

  // doc.setTextColor(235, 240, 235);
  // doc.setFont("helvetica", "bold");
  // doc.setFontSize(52);

  // doc.text("LANDGUARD AI", 18, 210, {
  //   angle: 35,
  // });

  // doc.restoreGraphicsState();

  // ---------------- FOOTER ----------------
  doc.setDrawColor(...emerald);
  doc.setLineWidth(0.5);
  doc.line(14, 266, 196, 266);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...emerald);
  doc.text("VERIFIED BY LANDGUARD AI", 14, 274);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...gray);

  doc.text(
    "Government of West Bengal • Directorate of Forests • Smart India Hackathon 2026",
    14,
    280
  );

  doc.text(
    "Generated using AI Satellite Change Detection Pipeline (Prototype Version)",
    14,
    286
  );

  // ---------------- SAVE ----------------
  doc.save(`LandGuardAI_${data.district.replace(/\s+/g, "_")}_Report.pdf`);
}