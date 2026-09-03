from sqlalchemy import text
from app.core.database import engine


def generate_heatmap():
    """
    Generate AI Heatmap using Projects + AI Alerts.
    Returns GeoJSON FeatureCollection.
    """

    query = text("""
        SELECT json_build_object(
            'type', 'FeatureCollection',

            'features', json_agg(

                json_build_object(
                    'type', 'Feature',

                    'geometry',
                    ST_AsGeoJSON(d.boundary)::json,

                    'properties',
                    json_build_object(

                        'district_name', d.district_name,
                        'state', d.state,

                        'project_count', COALESCE(project_stats.project_count,0),
                        'ongoing_projects', COALESCE(project_stats.ongoing_projects,0),
                        'planned_projects', COALESCE(project_stats.planned_projects,0),
                        'total_cost', COALESCE(project_stats.total_cost,0),

                        'alert_count', COALESCE(alert_stats.alert_count,0),
                        'alert_points', COALESCE(alert_stats.alert_points,0),
                        'active_alerts', COALESCE(alert_stats.alert_count,0),
                        'risk_score',
                        LEAST(
                            100,
                            (
                                COALESCE(project_stats.project_count,0) * 8
                                + COALESCE(project_stats.ongoing_projects,0) * 5
                                + COALESCE(project_stats.total_cost,0) / 250
                                + COALESCE(alert_stats.alert_points,0)
                            )
                        ),

                        'risk_level',
                        CASE
                            WHEN (
                                COALESCE(project_stats.project_count,0) * 8 +
                                COALESCE(project_stats.ongoing_projects,0) * 5 +
                                COALESCE(project_stats.total_cost,0) / 250 +
                                COALESCE(alert_stats.alert_points,0)
                            ) >= 75 THEN 'High'

                            WHEN (
                                COALESCE(project_stats.project_count,0) * 8 +
                                COALESCE(project_stats.ongoing_projects,0) * 5 +
                                COALESCE(project_stats.total_cost,0) / 250 +
                                COALESCE(alert_stats.alert_points,0)
                            ) >= 40 THEN 'Medium'

                            ELSE 'Low'

                        END
                    )
                )
            )
        ) AS geojson

        FROM districts d

        LEFT JOIN (
            SELECT
                district_name,

                COUNT(*) AS project_count,

                SUM(
                    CASE
                        WHEN status='Ongoing' THEN 1
                        ELSE 0
                    END
                ) AS ongoing_projects,

                SUM(
                    CASE
                        WHEN status='Planned' THEN 1
                        ELSE 0
                    END
                ) AS planned_projects,

                SUM(estimated_cost) AS total_cost

            FROM projects

            GROUP BY district_name

        ) project_stats

        ON d.district_name = project_stats.district_name

        LEFT JOIN (
            SELECT
                district_name,

                COUNT(*) AS alert_count,

                SUM(
                    CASE
                        WHEN severity='High' THEN 25
                        WHEN severity='Medium' THEN 15
                        WHEN severity='Low' THEN 8
                        ELSE 0
                    END
                ) AS alert_points

            FROM alerts

            WHERE status != 'Resolved'

            GROUP BY district_name

        ) alert_stats

        ON d.district_name = alert_stats.district_name;
    """)

    with engine.connect() as conn:
        return conn.execute(query).scalar()