import { useState } from "react";
import {
    Shield,
    Satellite,
    Bell,
    Database,
    Globe,
    Cpu,
    CheckCircle,
} from "lucide-react";

export default function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [autoSync, setAutoSync] = useState(true);

    return (
        <div className="min-h-screen text-slate-100 space-y-8 pb-10">
            {/* Header */}
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-8">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-emerald-500/15 p-4">
                        <Shield className="h-8 w-8 text-emerald-400" />
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                            LandGuard AI
                        </p>

                        <h1 className="text-3xl font-bold mt-1">
                            System Settings
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Configure AI monitoring, satellite synchronization and dashboard preferences.
                        </p>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="flex items-center gap-3 text-xl font-semibold mb-5">
                    <Shield className="text-emerald-400" />
                    Appearance
                </h2>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Dark Command Center Theme</p>
                        <p className="text-sm text-slate-400">
                            Recommended for satellite intelligence dashboard.
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Dark Command Center Theme</p>
                            <p className="text-sm text-slate-400">
                                Official LandGuard AI interface optimized for satellite intelligence and GIS monitoring.
                            </p>
                        </div>

                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                            Default Theme
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="flex items-center gap-3 text-xl font-semibold mb-5">
                    <Bell className="text-amber-400" />
                    Notifications
                </h2>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Live Encroachment Alerts</p>
                        <p className="text-sm text-slate-400">
                            Receive alerts whenever AI detects new land encroachment.
                        </p>
                    </div>

                    <button
                        onClick={() => setNotifications(!notifications)}
                        className={`px-4 py-2 rounded-xl font-semibold transition ${notifications
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-800 text-white"
                            }`}
                    >
                        {notifications ? "ON" : "OFF"}
                    </button>
                </div>
            </div>

            {/* Satellite Sync */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
                <h2 className="flex items-center gap-3 text-xl font-semibold">
                    <Satellite className="text-cyan-400" />
                    Satellite Synchronization
                </h2>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Automatic Sentinel-2 Sync</p>
                        <p className="text-sm text-slate-400">
                            Automatically fetch latest satellite imagery every orbital pass.
                        </p>
                    </div>

                    <button
                        onClick={() => setAutoSync(!autoSync)}
                        className={`px-4 py-2 rounded-xl font-semibold transition ${autoSync
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-800 text-white"
                            }`}
                    >
                        {autoSync ? "Enabled" : "Disabled"}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <p className="text-slate-400 text-sm">Primary Satellite</p>
                        <p className="mt-2 font-semibold">Sentinel-2B</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <p className="text-slate-400 text-sm">Secondary Source</p>
                        <p className="mt-2 font-semibold">Landsat-9</p>
                    </div>
                </div>
            </div>

            {/* AI Model */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="flex items-center gap-3 text-xl font-semibold mb-5">
                    <Cpu className="text-violet-400" />
                    AI Detection Engine
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        ["Detection Model", "YOLOv8 + ResNet UNet"],
                        ["Inference Accuracy", "98.2%"],
                        ["Risk Threshold", "70/100"],
                    ].map(([title, value]) => (
                        <div
                            key={title}
                            className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                        >
                            <p className="text-xs uppercase text-slate-500">{title}</p>
                            <p className="mt-2 text-lg font-semibold">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Database */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="flex items-center gap-3 text-xl font-semibold mb-5">
                    <Database className="text-emerald-400" />
                    Data Sources
                </h2>

                <div className="space-y-3">
                    {[
                        "Sentinel-2 Multispectral Imagery",
                        "Landsat-9 Satellite Archive",
                        "West Bengal District Boundary GIS Layer",
                        "Forest Department Monitoring Dataset",
                    ].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                        >
                            <CheckCircle className="text-emerald-400 h-5 w-5" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* About */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-slate-900 to-emerald-950/30 p-6">
                <h2 className="flex items-center gap-3 text-xl font-semibold mb-4">
                    <Globe className="text-emerald-400" />
                    About LandGuard AI
                </h2>

                <div className="space-y-2 text-slate-300">
                    <p>Version: SIH 2026 MVP v1.0</p>
                    <p>Organization: Government of West Bengal • Directorate of Forests</p>
                    <p>Satellite Intelligence Platform for AI-based Land Encroachment Detection.</p>
                </div>

                <div className="mt-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                    <p className="text-sm text-emerald-300">
                        Verified Build • Smart India Hackathon 2026 Prototype
                    </p>
                </div>
            </div>
        </div>
    );
}