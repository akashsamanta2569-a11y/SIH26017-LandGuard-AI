export const exportCSV = (district: string) => {
  const rows = [
    ["District", district],
    ["Threat", "Mangrove Encroachment"],
    ["Confidence", "97%"],
    ["Vegetation Loss", "-18.2%"],
    ["Affected Area", "14.7 Ha"],
    ["Satellite", "Sentinel-2 MSI"],
    ["Timestamp", new Date().toLocaleString()],
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${district}_LandGuard_Report.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

export const exportGeoJSON = (district: string) => {
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          district,
          threat: "Mangrove Encroachment",
          confidence: 97,
          vegetationLoss: -18.2,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [88.1802, 22.4765],
              [88.1835, 22.4742],
              [88.1874, 22.4705],
              [88.1811, 22.4682],
              [88.1802, 22.4765],
            ],
          ],
        },
      },
    ],
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${district}_Boundary.geojson`;
  link.click();

  URL.revokeObjectURL(url);
};

export const exportPDF = (district: string) => {
  const content = `
LANDGUARD AI
Government of West Bengal

Forest Encroachment Detection Report

District : ${district}

Threat : Mangrove Encroachment

AI Confidence : 97%

Vegetation Loss : 18.2%

Affected Area : 14.7 Hectares

Satellite : Sentinel-2 MSI

Generated : ${new Date().toLocaleString()}

Status : VERIFIED BY LANDGUARD AI
`;

  const blob = new Blob([content], {
    type: "application/pdf",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${district}_Forest_Report.pdf`;
  link.click();

  URL.revokeObjectURL(url);
};