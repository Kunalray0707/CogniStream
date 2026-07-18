"""
CogniStream ingestion DAG (optional module).

This DAG schedules the same Polars -> ClickHouse pipeline used for the
one-off CSV import (backend/app/scripts/import_csv.py), reframed as a
recurring job — the "Orchestration (Apache Airflow)" module described
in the project brief, where a production version of CogniStream would
pull fresh event logs from GitHub/Jira/Slack/IDE APIs on a schedule
instead of a static CSV.

Not wired into docker-compose.yml by default: a full Airflow deployment
(webserver + scheduler + metadata DB) is significant extra infrastructure
for a project whose core deliverable is the analytics dashboard, and
isn't required to run or grade CogniStream. To use it, either run it
against a local Airflow install (`pip install apache-airflow`, then
point AIRFLOW_HOME's dags folder at this file), or add an official
`apache/airflow` service to docker-compose.yml that mounts this
directory to /opt/airflow/dags.
"""
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator

default_args = {
    "owner": "cognistream",
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="cognistream_ingestion",
    description="Pull developer activity data and refresh ClickHouse analytics tables",
    default_args=default_args,
    schedule="@daily",
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=["cognistream", "ingestion"],
) as dag:

    ensure_tables = BashOperator(
        task_id="ensure_tables_exist",
        bash_command="cd /opt/backend && python -m app.scripts.create_tables",
    )

    run_ingestion = BashOperator(
        task_id="run_polars_ingestion",
        bash_command="cd /opt/backend && python -m app.scripts.import_csv --reset",
    )

    ensure_tables >> run_ingestion
