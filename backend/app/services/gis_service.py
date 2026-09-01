from sqlalchemy import text
from app.core.database import SessionLocal


def get_all_districts():
    """
    Returns all West Bengal districts as GeoJSON FeatureCollection.
    """

    db = SessionLocal()

    query = text("""
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(
                json_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(boundary)::json,
                    'properties', json_build_object(
                        'id', id,
                        'district_name', district_name,
                        'state', state,
                        'risk_level', risk_level
                    )
                )
            )
        ) AS geojson
        FROM districts;
    """)

    result = db.execute(query).scalar()

    db.close()

    return result