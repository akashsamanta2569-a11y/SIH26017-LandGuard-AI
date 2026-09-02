from sqlalchemy import text
from app.core.database import engine


def get_live_alerts():
    """
    Returns all AI alerts as GeoJSON.
    """

    query = text("""
        SELECT json_build_object(
            'type','FeatureCollection',
            'features', json_agg(
                json_build_object(
                    'type','Feature',

                    'geometry',
                    json_build_object(
                        'type','Point',
                        'coordinates',
                        json_build_array(longitude, latitude)
                    ),

                    'properties',
                    json_build_object(
                        'id', id,
                        'district_name', district_name,
                        'alert_type', alert_type,
                        'severity', severity,
                        'confidence', confidence,
                        'source', source,
                        'status', status,
                        'created_at', created_at
                    )
                )
            )
        ) AS geojson

        FROM alerts;
    """)

    with engine.connect() as conn:
        return conn.execute(query).scalar()


def get_alert_summary():
    """
    Dashboard summary of alerts.
    """

    query = text("""
        SELECT json_build_object(

            'total_alerts',
            COUNT(*),

            'high_alerts',
            SUM(CASE WHEN severity='High' THEN 1 ELSE 0 END),

            'medium_alerts',
            SUM(CASE WHEN severity='Medium' THEN 1 ELSE 0 END),

            'low_alerts',
            SUM(CASE WHEN severity='Low' THEN 1 ELSE 0 END),

            'active_alerts',
            SUM(CASE WHEN status='Active' THEN 1 ELSE 0 END),

            'investigating_alerts',
            SUM(CASE WHEN status='Investigating' THEN 1 ELSE 0 END),

            'resolved_alerts',
            SUM(CASE WHEN status='Resolved' THEN 1 ELSE 0 END)

        ) AS summary

        FROM alerts;
    """)

    with engine.connect() as conn:
        return conn.execute(query).scalar()


def get_high_severity_alerts():
    """
    Returns only High severity alerts.
    """

    query = text("""
        SELECT
            district_name,
            alert_type,
            severity,
            confidence,
            source,
            latitude,
            longitude,
            status,
            created_at

        FROM alerts

        WHERE severity='High'

        ORDER BY confidence DESC;
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).mappings().all()
        return [dict(r) for r in rows]