import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import type { HistoryItem } from "../types/history";

import HistoryHero from "../components/history/HistoryHero";
import HistoryGrid from "../components/history/HistoryGrid";
import BeforeAfterCard from "../components/history/BeforeAfterCard";
import DetectionTimeline from "../components/history/DetectionTimeline";
import ExportReportCard from "../components/history/ExportReportCard";

// ✅ STEP 7: Created correct mapping matching district names
const beforeAfterData: Record<
    string,
    {
        beforeImage: string;
        afterImage: string;
        vegetationLoss: number;
        affectedArea: number;
        confidence: number;
    }
> = {
    Howrah: {
        beforeImage: "/mock/howrah_before.jpg",
        afterImage: "/mock/howrah_after.jpg",
        vegetationLoss: 12.8,
        affectedArea: 18.6,
        confidence: 94,
    },

    Kolkata: {
        beforeImage: "/mock/kolkata_before.jpg",
        afterImage: "/mock/kolkata_after.jpg",
        vegetationLoss: 8.2,
        affectedArea: 10.1,
        confidence: 91,
    },

    "South 24 Parganas": {
        beforeImage: "/mock/s24_before.jpg",
        afterImage: "/mock/s24_after.jpg",
        vegetationLoss: 14.2,
        affectedArea: 17.4,
        confidence: 97,
    },

    "Paschim Bardhaman": {
        beforeImage: "/mock/bardhaman_before.jpg",
        afterImage: "/mock/bardhaman_after.jpg",
        vegetationLoss: 11.3,
        affectedArea: 13.8,
        confidence: 92,
    },

    Darjeeling: {
        beforeImage: "/mock/darjeeling_before.jpg",
        afterImage: "/mock/darjeeling_after.jpg",
        vegetationLoss: 6.5,
        affectedArea: 7.2,
        confidence: 90,
    },
};
function getDistrictMockData(districtName: string) {
    if (beforeAfterData[districtName]) return beforeAfterData[districtName];
    const lower = districtName.toLowerCase();
    if (lower.includes("howrah")) return beforeAfterData.Howrah;
    if (lower.includes("24") || lower.includes("sundarban") || lower.includes("south"))
        return beforeAfterData["South 24 Parganas"];
    if (lower.includes("kolkata")) return beforeAfterData.Kolkata;
    if (lower.includes("bardhaman") || lower.includes("paschim"))
        return beforeAfterData["Paschim Bardhaman"];
    if (lower.includes("darjeeling") || lower.includes("kalimpong"))
        return beforeAfterData.Darjeeling;
    return beforeAfterData.Howrah;
}

const defaultHistory: HistoryItem[] = [
    { district: "South 24 Parganas", date: "5 Sept 2026", threat: "Mangrove Encroachment" },
    { district: "Howrah", date: "4 Sept 2026", threat: "Industrial Expansion" },
    { district: "Kolkata", date: "3 Sept 2026", threat: "Wetland Filling" },
    { district: "Darjeeling", date: "2 Sept 2026", threat: "Forest Clearing" },
    { district: "Paschim Bardhaman", date: "1 Sept 2026", threat: "Mining Expansion" },
];

export default function PredictionHistory() {
    const location = useLocation();

    // Read incoming detection data from navigation state
    const detection = (location.state as {
        district: string;
        imageUrl?: string;
        confidence: number;
        vegetationLoss: number;
        affectedArea: number;
        riskScore: number;
    }) ?? {
        district: "Howrah",
        confidence: 94,
        vegetationLoss: -12.8,
        affectedArea: 18.6,
        riskScore: 91,
    };

    const [toast, setToast] = useState("");

    // Assemble dynamic history list with latest scan at top while keeping all districts visible
    const displayList: HistoryItem[] = useMemo(() => {
        const baseList: HistoryItem[] = defaultHistory.map((item) => {
            const mock = getDistrictMockData(item.district);
            return {
                ...item,
                beforeImage: mock.beforeImage,
                afterImage: mock.afterImage,
                vegetationLoss: mock.vegetationLoss,
                affectedArea: mock.affectedArea,
                confidence: mock.confidence,
                isNew: false,
            };
        });

        if (detection?.district) {
            const matchedData = getDistrictMockData(detection.district);

            const newDetection: HistoryItem = {
                district: detection.district,
                date: "Just Now",
                threat: "Latest AI Scan",
                beforeImage: matchedData.beforeImage,
                afterImage: matchedData.afterImage,
                vegetationLoss:
                    typeof detection.vegetationLoss === "number"
                        ? Math.abs(detection.vegetationLoss)
                        : matchedData.vegetationLoss,
                affectedArea: detection.affectedArea ?? matchedData.affectedArea,
                confidence: detection.confidence ?? matchedData.confidence,
                riskScore: detection.riskScore,
                isNew: true,
            };

            return [
                newDetection,
                ...baseList.filter(
                    (item) => item.district.toLowerCase() !== detection.district.toLowerCase()
                ),
            ];
        }

        return baseList;
    }, [detection]);

    const [selectedHistory, setSelectedHistory] = useState<HistoryItem>(
        displayList[0]
    );

    useEffect(() => {
        if (displayList.length > 0) {
            setSelectedHistory(displayList[0]);
        }
    }, [displayList]);

    const selectedImages = getDistrictMockData(selectedHistory.district);

    return (
        <div className="p-6 space-y-8">
            <HistoryHero
                totalDetections={displayList.length}
                criticalCases={5}
                averageConfidence={detection.confidence}
                searchQuery=""
                onSearchChange={() => { }}
            />

            <HistoryGrid
                items={displayList}
                selectedId={selectedHistory.district}
                onSelect={setSelectedHistory}
            />

            {/* BeforeAfterCard updates dynamically on card selection with matching district images */}
            <BeforeAfterCard
                district={selectedHistory.district}
                beforeImage={selectedHistory.beforeImage || selectedImages.beforeImage}
                afterImage={selectedHistory.afterImage || selectedImages.afterImage}
                vegetationLoss={
                    typeof selectedHistory.vegetationLoss === "number"
                        ? Math.abs(selectedHistory.vegetationLoss)
                        : selectedImages.vegetationLoss
                }
                affectedArea={selectedHistory.affectedArea ?? selectedImages.affectedArea}
                confidence={selectedHistory.confidence ?? selectedImages.confidence}
                threat={selectedHistory.threat}
                date={selectedHistory.date}
            />

            <DetectionTimeline
                district={selectedHistory.district}
                timestamp={selectedHistory.date}
            />

            <ExportReportCard
                district={selectedHistory.district}
                confidence={Number(selectedHistory.confidence ?? 94)}
                vegetationLoss={Number(selectedHistory.vegetationLoss ?? -12.8)}
                affectedArea={Number(selectedHistory.affectedArea ?? 18.6)}
                riskScore={Number(selectedHistory.riskScore ?? 91)}
                threat={selectedHistory.threat}
                date={selectedHistory.date}
                onToast={setToast}
            />
            {toast && (
                <div className="fixed bottom-6 right-6 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
}