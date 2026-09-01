# LandGuard AI — API Documentation (MVP)

**Backend:** FastAPI

**Frontend:** Next.js

**Response Format:** JSON

**Base URL (Local)**

http://localhost:8000/api/v1

---

## Dashboard APIs

### GET /dashboard/overview

Returns KPI cards for dashboard.

Response:

* Active Projects
* High Risk Projects
* Medium Risk Projects
* Alerts Today
* Average Risk

Frontend Uses:

National Dashboard KPI Cards.

---

### GET /dashboard/barasat

Returns pilot district summary.

Response includes:

District Name

Risk Distribution

Active Alerts

Stage Completion Summary

Map Center Coordinates

Used on:

Barasat Dashboard.

---

## Projects APIs

### GET /projects

Returns all monitored projects.

Filters:

district

risk_level

stage

project_type

Example:

/projects?district=Barasat&risk_level=High

---

### GET /projects/{project_id}

Returns complete project details.

Includes:

Project Metadata

RFCTLARR Stage

Risk Score

Timeline

Recommendation

---

## Prediction APIs

### POST /prediction/run

Runs AI prediction for one project.

Input:

Project ID

Output:

Risk Score

Confidence

Predicted Delay Stage

SHAP Drivers

---

### GET /prediction/{project_id}

Returns latest prediction.

Frontend Uses:

Risk Gauge.

---

## GIS APIs

### GET /gis/barasat-risk-map

Returns GeoJSON features.

Each feature contains:

Project ID

Latitude

Longitude

Risk Score

Risk Color

Used by:

Interactive Heatmap.

---

### GET /gis/district-boundary

Returns Barasat GeoJSON polygon.

Used to draw district boundary.

---

## Alert APIs

### GET /alerts

Returns active alerts.

Response:

Severity

Project Name

Stage

Risk

Time

---

### PATCH /alerts/{alert_id}

Mark alert resolved.

---

## Recommendation APIs

### GET /recommendations/{project_id}

Returns AI recommendations.

Response:

Root Cause

Suggested Action

Department

Deadline

Priority

---

## Sample JSON Response

GET /dashboard/overview

{
"active_projects":248,
"high_risk_projects":37,
"medium_risk_projects":84,
"alerts_today":12,
"average_delay_risk":43
}

---

## MVP API Flow

Dashboard

↓

Projects

↓

Prediction Engine

↓

GIS Heatmap

↓

Alerts

↓

Recommendations

---

## Status Codes

200 — Success

201 — Created

400 — Invalid Request

404 — Project Not Found

500 — Internal Server Error

---

## MVP Scope

Only Barasat pilot district is enabled.

Future API versions will support all districts in West Bengal and nationwide expansion.
