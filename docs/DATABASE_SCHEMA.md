# LandGuard AI — Database Schema (SIH26017)

**Project:** Predictive Analytics System for Early Detection of Land Acquisition Delays

**Database:** PostgreSQL + PostGIS

**Pilot Dataset:** Barasat (North 24 Parganas, West Bengal)

---

## Overview

The LandGuard AI database stores infrastructure project information, district GIS boundaries, AI-generated risk predictions, alerts, and recommendations. The MVP begins with Barasat and is designed to scale to district, state, and national levels.

---

# ER Diagram (Logical)

District → Projects → Predictions → Alerts → Recommendations

One district contains many projects.

Each project has one latest prediction.

High-risk predictions generate alerts.

Alerts generate recommendations.

---

# Table 1 — districts

Purpose: Store district metadata and GIS information.

| Field          | Type      | Description                  |
| -------------- | --------- | ---------------------------- |
| id             | UUID      | Primary key                  |
| name           | VARCHAR   | District name                |
| state          | VARCHAR   | State name                   |
| geojson_path   | TEXT      | Path to GeoJSON boundary     |
| total_projects | INTEGER   | Number of monitored projects |
| created_at     | TIMESTAMP | Record creation time         |

Example:

Barasat

North 24 Parganas

West Bengal

---

# Table 2 — projects

Purpose: Store infrastructure project details.

| Field               | Type      | Description                         |
| ------------------- | --------- | ----------------------------------- |
| id                  | UUID      | Project ID                          |
| district_id         | UUID      | Foreign key to districts            |
| project_name        | VARCHAR   | Project title                       |
| project_type        | VARCHAR   | Road / Railway / Metro / Industrial |
| stage               | VARCHAR   | RFCTLARR stage                      |
| land_area_acres     | FLOAT     | Land required                       |
| affected_families   | INTEGER   | Families affected                   |
| compensation_status | VARCHAR   | Pending / Partial / Completed       |
| legal_disputes      | INTEGER   | Number of active disputes           |
| approval_status     | VARCHAR   | Pending / Approved                  |
| latitude            | FLOAT     | GIS location                        |
| longitude           | FLOAT     | GIS location                        |
| created_at          | TIMESTAMP | Created time                        |

Pilot Example:

Barasat Bypass Expansion

Road

Compensation Stage

---

# Table 3 — predictions

Purpose: Store AI prediction results.

| Field            | Type      | Description         |
| ---------------- | --------- | ------------------- |
| id               | UUID      | Prediction ID       |
| project_id       | UUID      | Linked project      |
| risk_score       | FLOAT     | 0–100               |
| risk_level       | VARCHAR   | Low / Medium / High |
| predicted_stage  | VARCHAR   | Delay stage         |
| confidence_score | FLOAT     | Model confidence    |
| prediction_date  | TIMESTAMP | Generated time      |

Example:

Risk Score: 82%

Risk Level: High

Confidence: 91%

---

# Table 4 — alerts

Purpose: Store live alerts shown on dashboard.

| Field         | Type      | Description              |
| ------------- | --------- | ------------------------ |
| id            | UUID      | Alert ID                 |
| project_id    | UUID      | Linked project           |
| severity      | VARCHAR   | Critical / High / Medium |
| alert_message | TEXT      | Human-readable alert     |
| status        | VARCHAR   | Active / Resolved        |
| generated_at  | TIMESTAMP | Alert time               |

Example Alert:

High Risk — Barasat Bypass Expansion

Pending compensation approvals detected.

---

# Table 5 — recommendations

Purpose: Store AI recommendations for officials.

| Field          | Type    | Description               |
| -------------- | ------- | ------------------------- |
| id             | UUID    | Recommendation ID         |
| alert_id       | UUID    | Linked alert              |
| recommendation | TEXT    | Suggested action          |
| priority       | VARCHAR | High / Medium / Low       |
| department     | VARCHAR | Responsible department    |
| due_days       | INTEGER | Suggested action deadline |

Example:

Notify District Land Officer.

Priority: High

Deadline: 48 Hours.

---

# RFCTLARR Stage Values

The `stage` field accepts only these values:

1. Social Impact Assessment (SIA)
2. Preliminary Notification (Section 11)
3. Survey & Consent
4. Rehabilitation & Resettlement (R&R)
5. Compensation
6. Possession
7. Project Ready / Completed

---

# Relationships

districts.id → projects.district_id

projects.id → predictions.project_id

projects.id → alerts.project_id

alerts.id → recommendations.alert_id

---

# MVP Scope (Barasat Pilot)

District: North 24 Parganas (Barasat)

Projects: 10–20 sample infrastructure projects.

GIS Boundary: GeoJSON district polygon.

AI Output: Risk score, alert, SHAP explanation, recommendation.

Scalable Path:

Barasat → West Bengal → National Dashboard.
