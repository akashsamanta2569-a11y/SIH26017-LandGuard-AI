export interface AlertData {
    id: string;
    district: string;
    title: string;
    description: string;

    severity: "Critical" | "High" | "Medium" | "Resolved";

    confidence: number;
    affectedArea: number;
    vegetationLoss: number;

    coordinates: {
        lat: number;
        lng: number;
    };

    sensor: string;
    status: string;
    timestamp: string;

    mouza: string;
    jlNumber: string;

    rfctlarr: string[];
    cadastreMatch: number;

    officer: string;

    beforeImage: string;
    afterImage: string;
}