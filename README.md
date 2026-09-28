# 🛰️ LandGuard AI

### Predictive Intelligence for Smarter Land Acquisition

> **Smart India Hackathon 2026 — SIH26017**  
> **Predictive Analytics for Land Acquisition — Ministry of Rural Development**

LandGuard AI is an **AI-powered geospatial decision-support platform** designed to help authorities identify, investigate, and monitor potential land-acquisition risks before they become major delays.

The platform brings together **district-level risk intelligence, satellite-based change detection, cadastral verification, multi-temporal analysis, statutory compliance intelligence, alerts, and project monitoring** into a single web-based workflow.

---

## 🌍 Why LandGuard AI?

Land acquisition is not a single-step process. Delays can emerge from multiple factors such as:

- Land-use changes and encroachment
- Vegetation or surface changes
- Cadastral boundary conflicts
- Compensation and rehabilitation issues
- Legal or statutory requirements
- Field verification and administrative follow-up

Traditional monitoring can require information to be collected and reviewed across multiple sources.

**LandGuard AI aims to make this process more proactive and evidence-driven.**

Instead of only asking:

> **"What is happening?"**

LandGuard AI helps answer:

> **"Where is the risk, what changed, what evidence supports it, and what should be investigated next?"**

---

# 🚀 Core Features

## 1. 🗺️ AI Risk Heatmap

Visualizes land-acquisition risk across **West Bengal districts** using a polygon-based GIS view.

The interface provides:

- District-level risk classification
- Critical / High / Medium / Low risk indicators
- AI risk scores
- Encroachment information
- Latest satellite scan information
- Vegetation-loss indicators
- District-level intelligence cards

---

## 2. 🛰️ AI Satellite Detection

The satellite intelligence module analyzes an Area of Interest and presents:

- Satellite imagery
- AI detection results
- Potential encroachment boundaries
- Affected area
- AI confidence
- NDVI vegetation loss
- Risk score
- Cadastral boundary matching
- Investigation intelligence

The prototype demonstrates how satellite evidence can be connected with cadastral and administrative information.

---

## 3. 📈 Multi-Temporal Change Detection

LandGuard AI does not rely only on a single image.

The **Prediction History** module compares observations across multiple time periods.

Example workflow:

```text
June 2026
   ↓
July 2026
   ↓
August 2026
   ↓
September 2026
```

The system can visualize changes such as:

- Vegetation loss
- Built-up footprint growth
- Cadastral encroachment
- Change progression
- AI confidence over time

This creates a chronological evidence trail for investigation.

---

## 4. 🚨 AI Alerts & Investigation Dossiers

Potentially significant incidents can be organized into an alert timeline.

Each alert can contain:

- Severity
- Location
- Satellite source
- Affected area
- AI confidence
- Before/after satellite evidence
- NDVI change
- Cadastral match
- AI explanation
- Field intelligence
- Recommended administrative action

The goal is to help officers move from **detection → verification → action**.

---

## 5. ⚖️ Statutory Compliance Intelligence

The platform incorporates a rule-based compliance workflow around the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act)**.

The prototype can surface relevant statutory considerations and administrative recommendations based on the investigation context.

> **Important:** LandGuard AI is a decision-support prototype. Its recommendations are not a substitute for legal advice, statutory interpretation, or official government procedures.

---

## 6. 📂 Monitored Projects

The project monitoring module provides a centralized view of monitored projects.

Each project can display:

- Project name
- Location
- Responsible agency
- Affected area
- Risk level
- Project progress
- GIS workspace entry point

This helps maintain a project-level view after an issue has been identified.

---

# 🧠 AI & Geospatial Approach

LandGuard AI combines multiple intelligence layers:

```text
                    ┌──────────────────────────┐
                    │   Satellite / GIS Data   │
                    │ Sentinel-2 / Cartosat-3  │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   Image & Data Analysis  │
                    │   NDVI / CV / Features   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       AI Models          │
                    │ YOLOv8 / XGBoost / SHAP │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   Risk & Change Layer    │
                    │ Risk Score / Detection   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ Cadastral Verification   │
                    │   GIS / PostGIS / GeoJSON│
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ Compliance & Intelligence│
                    │ Alerts / Recommendations │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ Government Decision UI   │
                    │ Dashboard / Maps / Logs  │
                    └──────────────────────────┘
```

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite |
| **UI** | Tailwind CSS, Ant Design, Lucide React |
| **Charts** | Recharts |
| **Animation** | Framer Motion |
| **State / Data** | TanStack React Query |
| **HTTP Client** | Axios |
| **Backend** | Python, FastAPI |
| **Database** | PostgreSQL |
| **Spatial Database** | PostGIS |
| **ORM / Spatial ORM** | SQLAlchemy, GeoAlchemy2 |
| **Machine Learning** | XGBoost, SHAP |
| **Computer Vision** | YOLOv8, OpenCV |
| **GIS** | Leaflet, React-Leaflet, GeoJSON |
| **Satellite Sources / Concepts** | Sentinel-2 MSI, Cartosat-3 |
| **Deployment** | Vercel for the frontend prototype |

---

# 📁 Project Structure

```text
SIH26017-LandGuard-AI/
│
├── backend/
│   ├── app/
│   │   ├── core/              # Configuration, database and security
│   │   ├── data/              # Seed/data loaders
│   │   ├── models/            # SQLAlchemy / GeoAlchemy2 models
│   │   ├── routers/           # FastAPI API routes
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business and spatial logic
│   │   └── main.py            # FastAPI entry point
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   └── landguard-ai-frontend/
│       ├── public/
│       │   └── mock/           # Prototype satellite imagery/assets
│       ├── src/
│       │   ├── api/            # API clients
│       │   ├── components/     # Reusable UI components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── pages/          # Application pages
│       │   ├── routes/         # React Router configuration
│       │   ├── styles/         # Styling and theme
│       │   ├── types/          # TypeScript types
│       │   └── utils/          # Utilities and export helpers
│       ├── package.json
│       ├── vite.config.ts
│       └── vercel.json
│
├── ai_model/
│   ├── weights/                # Model weights
│   ├── uploads/                # Input imagery
│   └── predictions/            # Processed outputs
│
├── dataset/
│   ├── raw/
│   ├── processed/
│   └── metadata/
│
├── gis/                        # Geospatial resources
├── docs/                       # Architecture, API and research docs
├── design/                     # UI/UX resources
└── prototype_assets/           # Demo/PPT assets
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have:

- **Node.js 20+**
- **npm**
- **Python 3.11+**
- **PostgreSQL**
- **PostGIS extension**
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/akashsamanta2569-a11y/SIH26017-LandGuard-AI.git
cd SIH26017-LandGuard-AI
```

> Replace the repository URL above if your team uses a different GitHub repository.

---

# 🖥️ Frontend Setup

```bash
cd frontend/landguard-ai-frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

From the project root:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

API documentation is available at:

```text
http://localhost:8000/docs
```

---

# 🗄️ Database Configuration

LandGuard AI uses **PostgreSQL + PostGIS** for spatial data.

Create a PostgreSQL database and enable PostGIS:

```sql
CREATE DATABASE landguard_ai;

\c landguard_ai

CREATE EXTENSION postgis;
```

Configure the backend environment variables according to your local setup.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/landguard_ai
```

> Never commit real database passwords, API keys, model credentials, or other secrets to GitHub.

---

# 🔐 Environment Variables

For local development, create the appropriate `.env` file required by your backend/frontend configuration.

Typical variables may include:

```env
DATABASE_URL=your_database_url
API_BASE_URL=http://localhost:8000
SECRET_KEY=your_secret_key
```

Only include variables actually required by your current implementation.

---

# 📊 Prototype Data

The current SIH prototype contains **demo/seeded datasets and prototype imagery** to demonstrate the complete workflow.

These datasets are intended for:

- UI demonstration
- Workflow validation
- Model/inference demonstration
- GIS visualization
- Hackathon presentation

They should **not be interpreted as an official live government dataset or official government decision system**.

---

# 🔄 Application Workflow

```text
District Risk
     ↓
Select District
     ↓
AI Satellite Detection
     ↓
Satellite / NDVI Analysis
     ↓
Cadastral Verification
     ↓
Risk & Evidence Generation
     ↓
Statutory Compliance Check
     ↓
AI Alert / Investigation Dossier
     ↓
Multi-Temporal History
     ↓
Project Monitoring
     ↓
Administrative Follow-up
```

---

# 🎥 Demo

### Live MVP

**https://landguard-ai-frontend.vercel.app/**

### Suggested Demo Flow

1. Overview Dashboard
2. District Risk Heatmap
3. Select a district
4. Open AI Satellite Detection
5. Review AI confidence, affected area and NDVI loss
6. Review cadastral verification
7. Open Live Alerts
8. Review satellite before/after evidence
9. Open Prediction History
10. Replay multi-temporal changes
11. Open Monitored Projects
12. End with the overall LandGuard AI workflow

---

# 📸 Screenshots

Add your final screenshots here after the UI is frozen:

```text
docs/screenshots/
├── dashboard.png
├── district-risk-map.png
├── satellite-detection.png
├── alerts.png
├── prediction-history.png
└── monitored-projects.png
```

Example:

```markdown
![LandGuard AI Dashboard](docs/screenshots/dashboard.png)
```

---

# 🎯 Expected Impact

LandGuard AI is designed around a **predictive and evidence-driven monitoring approach**.

Potential benefits include:

- Earlier identification of land-use changes
- Faster prioritization of high-risk areas
- Better integration of satellite and cadastral evidence
- Centralized project monitoring
- Improved investigation workflows
- More structured administrative follow-up
- Reduced dependence on fragmented information sources

---

# 🔮 Future Scope

The current implementation is a **working prototype/MVP**. Future development can include:

- 🇮🇳 Expansion from the West Bengal prototype to broader India coverage
- 🛰️ Integration with authorized live satellite-data services
- 🤖 Larger and more diverse AI training datasets
- 📍 More detailed cadastral parcel integration
- 📱 Mobile field-officer interface
- 🔔 Advanced notification and escalation workflows
- 🧠 Improved explainable risk prediction
- ☁️ Scalable cloud infrastructure
- 🔐 Role-based government access control
- 📑 Automated official report generation
- 📡 Continuous monitoring pipelines
- 🔗 Integration with additional authorized government data sources

---

# ⚠️ Prototype Disclaimer

LandGuard AI is a **Smart India Hackathon prototype** created for demonstrating a predictive decision-support workflow.

The project may use **synthetic, seeded, simulated, or prototype data and imagery** for demonstration.

AI-generated risk scores, detections, alerts, and recommendations should be treated as **decision-support outputs requiring human verification**.

The system does not replace:

- Official government records
- Field verification
- Legal due process
- Statutory authorities
- Professional legal advice
- Official land-acquisition decisions

---

# 👥 Team

### LandGuard AI — Brainware University

| Member | Role |
|---|---|
| **[Team Member 1]** | Team Lead / AI-ML |
| **[Team Member 2]** | Backend / Database |
| **[Team Member 3]** | Frontend / UI |
| **[Team Member 4]** | GIS / Research |
| **[Team Member 5]** | GIS / Research |
| **[Team Member 6]** | GIS / Research |

> Replace the placeholders with your final team members and roles before publishing.

---

# 🏆 Smart India Hackathon 2026

**Problem Statement:** SIH26017  
**Theme:** Predictive Analytics for Land Acquisition  
**Institution:** Brainware University  
**Project:** LandGuard AI

---

# 📚 Research & References

The project research is informed by sources and technical areas including:

- Ministry of Rural Development / Department of Land Resources resources
- Open Government Data (OGD) India
- RFCTLARR Act, 2013
- Official land-acquisition administrative guidelines
- ISRO / NRSC geospatial resources
- Sentinel-2 documentation
- Cartosat-3 resources
- XGBoost research
- SHAP / Explainable AI research

For the final submission, add the exact URLs, papers, datasets, and access dates used by your team.

---

## 🛰️ LandGuard AI

### Predictive Intelligence for Smarter Land Acquisition

**Smart India Hackathon 2026 · SIH26017 · Brainware University**

*Detect earlier. Understand better. Act smarter.*

</div>
