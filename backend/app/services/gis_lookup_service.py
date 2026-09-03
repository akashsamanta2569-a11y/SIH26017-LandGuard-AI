from sqlalchemy import text
from app.core.database import engine


def find_district(latitude: float, longitude: float):
    """
    Find which district contains this GPS point.
    """

    query = text("""
        SELECT district_name

        FROM districts

        WHERE ST_Contains(
            boundary,
            ST_SetSRID(
                ST_Point(:lon, :lat),
                4326
            )
        )

        LIMIT 1
    """)

    with engine.connect() as conn:
        result = conn.execute(
            query,
            {"lat": latitude, "lon": longitude}
        ).fetchone()

    if result:
        return result[0]

    return None