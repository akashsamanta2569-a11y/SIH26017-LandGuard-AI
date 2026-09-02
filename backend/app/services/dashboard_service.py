from sqlalchemy import text
from app.core.database import engine


def get_dashboard_summary():
    """
    Returns summary statistics for the LandGuard AI dashboard.
    """

    query = text("""
        WITH district_stats AS (

            SELECT
                d.district_name,

                COUNT(p.id) AS project_count,

                SUM(
                    CASE
                        WHEN p.status='Ongoing' THEN 1
                        ELSE 0
                    END
                ) AS ongoing_projects,

                SUM(
                    CASE
                        WHEN p.status='Planned' THEN 1
                        ELSE 0
                    END
                ) AS planned_projects,

                SUM(p.estimated_cost) AS total_cost,

                LEAST(
                    100,
                    COUNT(p.id)*15 +
                    SUM(
                        CASE
                            WHEN p.status='Ongoing' THEN 10
                            ELSE 0
                        END
                    ) +
                    COALESCE(SUM(p.estimated_cost),0)/150
                ) AS risk_score

            FROM districts d

            LEFT JOIN projects p
            ON d.district_name = p.district_name

            GROUP BY d.district_name
        )

        SELECT json_build_object(

            'total_projects',
            (SELECT COUNT(*) FROM projects),

            'ongoing_projects',
            (SELECT COUNT(*) FROM projects WHERE status='Ongoing'),

            'planned_projects',
            (SELECT COUNT(*) FROM projects WHERE status='Planned'),

            'high_risk_districts',
            (SELECT COUNT(*) FROM district_stats WHERE risk_score>=70),

            'medium_risk_districts',
            (SELECT COUNT(*) FROM district_stats
                WHERE risk_score>=35 AND risk_score<70),

            'low_risk_districts',
            (SELECT COUNT(*) FROM district_stats WHERE risk_score<35),

            'total_estimated_cost',
            (SELECT COALESCE(SUM(estimated_cost),0) FROM projects)

        ) AS summary;
    """)

    with engine.connect() as conn:
        return conn.execute(query).scalar()
    