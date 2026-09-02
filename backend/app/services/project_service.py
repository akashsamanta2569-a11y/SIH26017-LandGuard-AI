from sqlalchemy import text
from app.core.database import engine


def get_projects_with_detected_district():
    """
    Detect district using PostGIS ST_Contains().
    """

    query = text("""
        SELECT
            p.project_name,
            p.department,
            p.status,
            p.estimated_cost,

            d.district_name AS detected_district,

            ST_Y(p.location::geometry) AS latitude,
            ST_X(p.location::geometry) AS longitude

        FROM projects p
        JOIN districts d
          ON ST_Contains(
                d.boundary::geometry,
                p.location::geometry
             );
    """)

    with engine.connect() as conn:
        result = conn.execute(query)
        return [dict(row._mapping) for row in result]