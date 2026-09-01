I have created a comprehensive, professional AI Data Schema and mapped it directly to the seven-stage land acquisition lifecycle under the RFCTLARR Act, 2013. 

The resulting workbook, **`land-acquisition-ai-data-fields-schema.xlsx`**, is now available in your **Studio** panel. This artifact is designed to serve as an audit-ready schema for your team's Smart India Hackathon project (SIH26017), mapping the baseline project parameters and key delay drivers directly to AI/ML inputs (features) and predicted outputs (risk targets).

### Overview of the AI Data Schema Structure
The data schema in the spreadsheet is color-coded to align with standard AI modeling practices:
*   **Blue-shaded rows (`Input / Model Features`)**: Feature parameters feeding directly into your AI/ML prediction models.
*   **Green-shaded rows (`AI Predicted Targets`)**: Calculated outputs, stage-specific delay probabilities, and predicted risk scores.
*   **Yellow-shaded rows (`Statutory Constraints`)**: Legally mandated thresholds or baseline multipliers set by the RFCTLARR Act.

---

### **RFCTLARR 2013 Stage-Wise Data Fields for AI Delay Prediction**

Below is a complete, structured reference table of the data fields mapped to the seven stages of the land acquisition lifecycle, as defined by your government source documents:

| Stage # & Name | Data Field ID | Field Name | Data Type | AI Modeling Purpose / Description | Mapped SIH26017 Delay Factor & Parameters | Sample Value |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Stage 1: Social Impact Assessment (SIA) Phase** | `project_type` | Project Category | Categorical | Primary feature determining baseline legal and administrative project complexity. | Project Type Parameter | Highways |
| | `land_area_ha` | Land Area (Hectares) | Numerical | Determines project scale; larger land scale strongly correlates with legal disputes and delays. | Land Area Parameter | 124.5 |
| | `affected_families_count` | Affected Families Count | Numerical | Scale of physical/livelihood displacement; high count raises rehabilitation risk. | Affected Families Parameter | 380 |
| | `sia_agency_status` | SIA Agency Status | Categorical | Tracks administrative speed in launching and appointing the independent SIA study. | Interdepartmental Coordination | Appointed |
| | `sia_hearing_objections` | SIA Hearing Objections | Numerical | Quantity of public objections recorded during local hearing meetings. | Administrative Bottlenecks / Stakeholder Responsiveness | 45 |
| | `sia_expert_review_days` | SIA Expert Review Days | Numerical | Days taken by the independent expert committee to clear the SIA report. | Prolonged Administrative Approvals | 58 |
| | **`sia_delay_probability`** | **SIA Stage Delay Risk** | **Percentage (AI Output)** | **Model predicted target for the probability of delay during the SIA phase.** | **SIA Stage Predicted Target** | **22.0%** |
| **Stage 2: Preliminary Notification Phase** | `sec11_notification_status` | Sec 11 Notice Status | Categorical | Tracks the publication status of the formal Section 11 preliminary notification in the gazette. | Pending Notifications | Pending |
| | `sec11_objections_filed` | Sec 11 Objections Count | Numerical | Number of formal written objections submitted by landowners within the mandatory 60-day window. | Legal Disputes & Land Boundary Objections | 12 |
| | `land_record_completeness` | Land Record Digitization % | Percentage | Metric tracking local land record completeness. Outdated titles block verification. | Incomplete Documentation | 78.0% |
| | `ownership_conflict_flag` | Land Ownership Conflict | Boolean | Identifies active, outstanding disputes in local registries over title deeds. | Land Ownership Conflicts | Yes |
| | **`sec11_delay_probability`** | **Sec 11 Delay Risk** | **Percentage (AI Output)** | **Model predicted target for the probability of delay during Section 11 notification.** | **Preliminary Notification Target** | **45.0%** |
| **Stage 3: Consent and Survey Phase** | `required_consent_pct` | Required Consent % | Percentage | Set by law: 80% for Private, 70% for PPP, and 0% for purely Government works. | Regulatory Consent Threshold | 70.0% |
| | `consent_obtained_pct` | Consent Obtained % | Percentage | Current verified collected written consent from affected families. | Stakeholder Responsiveness Parameter | 55.0% |
| | `boundary_survey_status` | Boundary Survey Status | Categorical | Tracks if survey teams have physically completed boundary marking and property valuations. | Administrative Bottlenecks | In Progress |
| | `disputed_parcels_count` | Survey Disputed Parcels | Numerical | Number of land parcels with boundary disputes encountered during physical surveys. | Land Ownership Conflicts / Legal Disputes | 8 |
| | **`consent_delay_probability`** | **Consent Delay Risk** | **Percentage (AI Output)** | **Model predicted target for the probability of delay during consent and survey gathering.** | **Consent & Survey Target** | **62.0%** |
| **Stage 4: Rehabilitation & Resettlement (R&R) Scheme** | `rr_plan_draft_status` | Draft R&R Plan Status | Categorical | Tracks the progress of the government Administrator in drafting the R&R relocation blueprint. | Administrative Approvals / Bottlenecks | Pending Draft |
| | `rr_beneficiaries_identified` | Verified Beneficiaries Count | Numerical | Number of displaced families officially mapped and verified for housing/livelihood benefits. | Rehabilitation Progress Parameter | 340 |
| | `rr_public_objections_count` | R&R Plan Objections | Numerical | Number of public objections raised during public review hearings of the draft welfare plan. | Rehabilitation and Resettlement Challenges | 19 |
| | `resettlement_site_status` | Resettlement Site Status | Categorical | Physical construction progress of the relocation colony or alternative housing. | Rehabilitation Status Parameter | Under Development |
| | **`rr_delay_probability`** | **R&R Stage Delay Risk** | **Percentage (AI Output)** | **Model predicted target for the probability of delay in the rehabilitation/resettlement scheme.** | **Rehabilitation & Resettlement Target** | **38.0%** |
| **Stage 5: Declaration and Final Award Phase** | `sec19_declaration_status` | Sec 19 Declaration Status | Categorical | Tracks publication of the Section 19 final declaration indicating the land is officially being acquired. | Pending Notifications | Pending |
| | `collector_award_valuation_inr` | Collector Valuation (INR Cr) | Numerical | Total monetary value of the compensation award passed by the District Collector. | Administrative Bottlenecks / Compensation Status | ₹45.80 Cr |
| | `award_deliberation_days` | Award Deliberation Days | Numerical | Total administrative days spent by the revenue office in negotiating and finalizing the award. | Prolonged Administrative Approvals | 90 |
| | **`award_delay_probability`** | **Award Stage Delay Risk** | **Percentage (AI Output)** | **Model predicted target for the probability of delay in passing the Collector's final award.** | **Declaration & Award Target** | **28.0%** |
| **Stage 6: Compensation Calculation** | `land_base_market_value` | Base Land Market Value | Numerical | The baseline historical market rate of the land before statutory multipliers are calculated. | Compensation Status Parameter | ₹15.20 Cr |
| | `multiplier_applied` | Rural/Urban Multiplier | Numerical | Factor of up to 2.0 for rural land, and 1.0 for urban land as determined by the location. | Compensation Status / Valuation Parameter | 2.0 |
| | `solatium_applied_pct` | Mandated Solatium Multiplier | Percentage | The RFCTLARR Act legally mandates a 100% solatium (comfort payment) over the total land value. | Regulatory Compensation Mandate | 100.0% |
| | `disputed_valuation_cases` | Valuation Court Appeals | Numerical | Active compensation disputes appealed directly to the Land Acquisition Authority. | Legal Disputes / Compensation Delays | 5 |
| | **`comp_delay_probability`** | **Compensation Delay Risk** | **Percentage (AI Output)** | **Model predicted target for the probability of delay in calculating, finalizing, or appealing compensation.** | **Compensation Calculation Target** | **50.0%** |
| **Stage 7: Possession Phase** | `compensation_disbursed_pct` | Compensation Disbursed % | Percentage | Current progress of electronic fund disbursements paid directly to landowners' bank accounts. | Delayed Compensation Disbursement | 40.0% |
| | `rr_monetary_benefits_cleared` | R&R Funds Cleared Status | Boolean | Checks if all R&R financial benefits have been disbursed (mandated within 6 months of award). | Compensation Status / Rehabilitation Progress | No |
| | `alternative_housing_handed_over` | Housing Colony Handed Over | Boolean | The law prohibits physical possession of land until alternative housing has been fully built. | Rehabilitation Status Parameter | No |
| | `physical_possession_pct` | Physical Possession % | Percentage | Percentage of physical land area successfully enclosed and handed over to the government. | Possession Status Parameter | 15.0% |
| | `injunction_active_flag` | Court Injunction Flag | Boolean | High-risk indicator identifying active court-issued stays blocking eviction or site hand-over. | Legal Disputes & Possession Hurdles | No |
| | **`possession_delay_probability`** | **Possession Stage Delay Risk** | **Percentage (AI Output)** | **Model predicted target for the probability of delay in completing physical land possession.** | **Possession Stage Target** | **70.0%** |

---

### **How to Use the Excel Artifact**
1. **Model Validation Reference**: Use the `AI Prediction Schema` sheet as the primary data dictionary for planning your SQL database tables or Pandas dataframes.
2. **Feature Engineering**: The "Field ID" column provides standard, lowercase snake-case identifiers (e.g., `sia_hearing_objections`, `consent_obtained_pct`) which you can import directly into Python as variable names or training dataframe columns.
3. **Interactive Navigation**: The `About Schema` sheet contains functional Excel hyperlinks (`Go →`) and a detailed legend explaining input, target, and baseline color themes so your team members can navigate and edit the files easily.

***

