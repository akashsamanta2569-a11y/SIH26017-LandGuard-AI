from sqlalchemy import text
from app.core.database import engine


def generate_heatmap():
    """
    Calculate project statistics and AI risk score for every district.
    Returns GeoJSON FeatureCollection.
    """

    query = text("""
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(
                json_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(d.boundary)::json,
                    'properties', json_build_object(
                        'district_name', d.district_name,
                        'state', d.state,

                        'project_count', COALESCE(stats.project_count, 0),
                        'ongoing_projects', COALESCE(stats.ongoing_projects, 0),
                        'planned_projects', COALESCE(stats.planned_projects, 0),
                        'total_cost', COALESCE(stats.total_cost, 0),

                        -- AI Risk Score
                        'risk_score',
                        ROUND(
                            LEAST(
                                100,
                                COALESCE(stats.project_count, 0) * 15 +
                                COALESCE(stats.ongoing_projects, 0) * 10 +
                                COALESCE(stats.total_cost, 0) / 150
                            )::numeric,
                            2
                        ),

                        -- AI Risk Level
                        'risk_level',
                        CASE
                            WHEN (
                                COALESCE(stats.project_count, 0) * 15 +
                                COALESCE(stats.ongoing_projects, 0) * 10 +
                                COALESCE(stats.total_cost, 0) / 150
                            ) >= 70 THEN 'High'

                            WHEN (
                                COALESCE(stats.project_count, 0) * 15 +
                                COALESCE(stats.ongoing_projects, 0) * 10 +
                                COALESCE(stats.total_cost, 0) / 150
                            ) >= 35 THEN 'Medium'

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
                        WHEN status = 'Ongoing' THEN 1
                        ELSE 0
                    END
                ) AS ongoing_projects,

                SUM(
                    CASE
                        WHEN status = 'Planned' THEN 1
                        ELSE 0
                    END
                ) AS planned_projects,

                SUM(estimated_cost) AS total_cost

            FROM projects
            GROUP BY district_name

        ) stats
        ON d.district_name = stats.district_name;
    """)

    with engine.connect() as conn:
        return conn.execute(query).scalar()