from sqlalchemy import text
from app.core.database import engine


def get_project_markers():
    """
    Returns all infrastructure projects as GeoJSON Points.
    """

    query = text("""
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(
                json_build_object(
                    'type', 'Feature',

                    'geometry', ST_AsGeoJSON(location)::json,

                    'properties', json_build_object(
                        'id', id,
                        'project_name', project_name,
                        'department', department,
                        'district_name', district_name,
                        'status', status,
                        'estimated_cost', estimated_cost
                    )
                )
            )
        ) AS geojson

        FROM projects;
    """)

    with engine.connect() as conn:
        return conn.execute(query).scalar()