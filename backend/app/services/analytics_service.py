"""
Analytics service layer.

All ClickHouse SQL lives here, kept separate from the FastAPI router so
the query logic can be tested/reused independently of the web layer.
"""
from clickhouse_driver import Client


def get_dashboard_summary(client: Client) -> dict:
    total_sessions = client.execute("SELECT count() FROM coding_sessions")[0][0]

    if not total_sessions:
        return {
            "total_sessions": 0,
            "average_cognitive_load": 0.0,
            "success_rate": 0.0,
            "total_commits": 0,
            "flow_state_rate": 0.0,
            "avg_context_switch_rate": 0.0,
        }

    avg_cognitive_load = client.execute("SELECT avg(cognitive_load) FROM cognitive_metrics")[0][0]
    success_rate = client.execute("SELECT avg(task_success) * 100 FROM cognitive_metrics")[0][0]
    total_commits = client.execute("SELECT sum(commits) FROM coding_sessions")[0][0]
    flow_state_rate = client.execute("SELECT avg(flow_state) * 100 FROM coding_sessions")[0][0]
    avg_context_switch_rate = client.execute(
        "SELECT avg(context_switch_rate) FROM coding_sessions"
    )[0][0]

    return {
        "total_sessions": total_sessions,
        "average_cognitive_load": round(avg_cognitive_load or 0, 2),
        "success_rate": round(success_rate or 0, 2),
        "total_commits": int(total_commits or 0),
        "flow_state_rate": round(flow_state_rate or 0, 2),
        "avg_context_switch_rate": round(avg_context_switch_rate or 0, 2),
    }


def get_trend(client: Client, limit: int = 30) -> list[dict]:
    """Daily trend of cognitive load, productivity and commits (most recent first)."""
    rows = client.execute(
        """
        SELECT
            cs.session_date AS session_date,
            avg(cm.cognitive_load) AS avg_cognitive_load,
            avg(cm.productivity_score) AS avg_productivity_score,
            sum(cs.commits) AS total_commits
        FROM coding_sessions cs
        INNER JOIN cognitive_metrics cm ON cs.id = cm.session_id
        GROUP BY cs.session_date
        ORDER BY cs.session_date DESC
        LIMIT %(limit)s
        """,
        {"limit": limit},
    )
    return [
        {
            "session_date": str(row[0]),
            "avg_cognitive_load": round(row[1], 2),
            "avg_productivity_score": round(row[2], 2),
            "total_commits": int(row[3]),
        }
        for row in reversed(rows)
    ]


def get_context_switching(client: Client) -> list[dict]:
    """
    The "Context-Switching Tax": buckets sessions by how many interruptions
    (distractions) occurred, showing the impact on cognitive load and
    productivity as interruptions increase.
    """
    rows = client.execute(
        """
        SELECT
            multiIf(
                cs.distractions = 0, '0',
                cs.distractions <= 2, '1-2',
                cs.distractions <= 4, '3-4',
                '5+'
            ) AS distraction_bucket,
            count() AS session_count,
            avg(cm.cognitive_load) AS avg_cognitive_load,
            avg(cm.productivity_score) AS avg_productivity_score
        FROM coding_sessions cs
        INNER JOIN cognitive_metrics cm ON cs.id = cm.session_id
        GROUP BY distraction_bucket
        ORDER BY
            multiIf(
                distraction_bucket = '0', 0,
                distraction_bucket = '1-2', 1,
                distraction_bucket = '3-4', 2,
                3
            )
        """
    )
    return [
        {
            "distraction_bucket": row[0],
            "session_count": row[1],
            "avg_cognitive_load": round(row[2], 2),
            "avg_productivity_score": round(row[3], 2),
        }
        for row in rows
    ]


def get_cognitive_load_distribution(client: Client) -> list[dict]:
    rows = client.execute(
        """
        SELECT cognitive_load_level, count() AS session_count
        FROM cognitive_metrics
        GROUP BY cognitive_load_level
        ORDER BY multiIf(
            cognitive_load_level = 'Low', 0,
            cognitive_load_level = 'Medium', 1,
            2
        )
        """
    )
    return [{"level": row[0], "session_count": row[1]} for row in rows]


def get_flow_state_summary(client: Client) -> list[dict]:
    rows = client.execute(
        """
        SELECT
            cs.flow_state AS flow_state,
            count() AS session_count,
            avg(cm.productivity_score) AS avg_productivity_score,
            avg(cs.commits) AS avg_commits
        FROM coding_sessions cs
        INNER JOIN cognitive_metrics cm ON cs.id = cm.session_id
        GROUP BY cs.flow_state
        ORDER BY cs.flow_state DESC
        """
    )
    return [
        {
            "flow_state": bool(row[0]),
            "session_count": row[1],
            "avg_productivity_score": round(row[2], 2),
            "avg_commits": round(row[3], 2),
        }
        for row in rows
    ]


def get_sessions(client: Client, limit: int = 20, offset: int = 0) -> list[dict]:
    rows = client.execute(
        """
        SELECT
            cs.id,
            cs.session_date,
            cs.hours_coding,
            cs.distractions,
            cs.commits,
            cm.cognitive_load,
            cm.cognitive_load_level,
            cm.productivity_score,
            cs.flow_state,
            cm.recommendation
        FROM coding_sessions cs
        INNER JOIN cognitive_metrics cm ON cs.id = cm.session_id
        ORDER BY cs.session_date DESC
        LIMIT %(limit)s OFFSET %(offset)s
        """,
        {"limit": limit, "offset": offset},
    )
    return [
        {
            "id": row[0],
            "session_date": str(row[1]),
            "hours_coding": row[2],
            "distractions": row[3],
            "commits": row[4],
            "cognitive_load": row[5],
            "cognitive_load_level": row[6],
            "productivity_score": row[7],
            "flow_state": bool(row[8]),
            "recommendation": row[9],
        }
        for row in rows
    ]
