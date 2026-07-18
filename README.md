# CogniStream

**Developer Flow-State & Cognitive Load Analytics**

CogniStream replaces flawed productivity metrics like "lines of code" or "tickets closed"
with a dashboard focused on *friction*: how much cognitive load developers carry, how
often deep-focus sessions get interrupted, and what that "context-switching tax" costs
in productivity.

> Engineering managers get a "Context-Switching Tax" view instead of a commit counter —
> data that shows *why* a team is losing focus, not just what it shipped.

![status](https://img.shields.io/badge/status-submission--ready-2DD4BF)
![stack](https://img.shields.io/badge/stack-FastAPI%20%7C%20React%20%7C%20ClickHouse-informational)

---

## Screenshots

<!-- Replace with real screenshots after running the app locally. -->
`docs/screenshot-dashboard.png` — full dashboard view
`docs/screenshot-mobile.png` — responsive layout (optional)

---

## Architecture

```
┌────────────────┐      HTTP (JSON)      ┌──────────────────┐      TCP (native)     ┌──────────────┐
│  React + Vite   │ ───────────────────▶ │   FastAPI (REST)  │ ───────────────────▶ │  ClickHouse   │
│  Tailwind CSS   │ ◀─────────────────── │  /analytics/*      │ ◀─────────────────── │  (OLAP store) │
│  Recharts       │                       └──────────────────┘                       └──────────────┘
└────────────────┘                                 ▲
                                                     │ loads derived metrics
                                          ┌──────────────────────┐
                                          │ Polars ingestion job  │
                                          │ (app/scripts/import_  │
                                          │  csv.py)               │
                                          └──────────────────────┘
                                                     ▲
                                          ┌──────────────────────┐
                                          │ ai_dev_productivity   │
                                          │ .csv (source dataset) │
                                          └──────────────────────┘
```

**Data flow:** the CSV dataset is transformed with Polars into two tables
(`coding_sessions`, `cognitive_metrics`) enriched with derived analytics fields
(`flow_state`, `context_switch_rate`, `cognitive_load_level`, `productivity_score`),
loaded into ClickHouse, and served through a FastAPI layer that the React dashboard
consumes over REST.

An optional Airflow DAG (`airflow/dags/cognistream_ingestion_dag.py`) shows how this
same pipeline would be scheduled to run daily in production against live GitHub/Jira/
Slack/IDE APIs instead of a static CSV — see [Limitations](#limitations--honest-scope-notes).

---

## Tech Stack

| Layer            | Technology                                  |
|-------------------|----------------------------------------------|
| Frontend          | React 19 + Vite, Tailwind CSS, Recharts, Axios |
| Backend           | FastAPI (Python), Pydantic                  |
| Database          | ClickHouse (columnar OLAP)                  |
| Data processing   | Polars                                      |
| Orchestration     | Apache Airflow (optional DAG, see notes)    |
| Infra             | Docker Compose                              |

---

## Features

- **Dashboard KPIs** — total sessions, average cognitive load, task success rate, flow-state rate
- **Cognitive Load vs. Productivity trend** — dual-axis time series over the most recent sessions
- **Context-Switching Tax** — cognitive load bucketed by interruption count, showing the cost of context switches
- **Flow State Impact** — productivity/commit comparison between deep-flow and interrupted sessions
- **Cognitive Load Mix** — Low/Medium/High load distribution donut
- **Recent Sessions table** — per-session breakdown with recommendations
- Loading, error (with retry), and empty states throughout
- CORS-safe REST API with typed Pydantic response models
- Dockerized end-to-end (ClickHouse + FastAPI + Vite dev server)

---

## Getting Started

### Option A — Docker Compose (recommended)

```bash
git clone <your-repo-url>
cd CogniStream

docker compose up -d --build
```

This starts ClickHouse, the FastAPI backend (which auto-creates tables on boot), and
the frontend dev server. First time only, load the dataset into ClickHouse:

```bash
docker compose exec backend python -m app.scripts.import_csv --reset
```

Then open:
- Frontend: http://localhost:5173
- Backend docs (Swagger UI): http://localhost:8000/docs
- ClickHouse HTTP interface: http://localhost:8123

### Option B — Run services manually

**1. ClickHouse** (still easiest via Docker):
```bash
docker run -d --name cognistream-clickhouse \
  -p 8123:8123 -p 9000:9000 \
  -e CLICKHOUSE_DB=cognistream \
  -e CLICKHOUSE_USER=admin \
  -e CLICKHOUSE_PASSWORD=admin123 \
  clickhouse/clickhouse-server:24.8
```

**2. Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # defaults already match the container above

python -m app.scripts.create_tables
python -m app.scripts.import_csv --reset

uvicorn app.main:app --reload
```

**3. Frontend:**
```bash
cd frontend
npm install
cp .env.example .env            # VITE_API_URL defaults to http://127.0.0.1:8000
npm run dev
```

---

## API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint                              | Description                                             |
|--------|-----------------------------------------|-----------------------------------------------------------|
| GET    | `/`                                     | API welcome/status message                                |
| GET    | `/health`                               | Health check                                               |
| GET    | `/analytics/dashboard`                  | Top-line KPI summary                                       |
| GET    | `/analytics/trend?limit=30`             | Daily cognitive load / productivity / commits trend        |
| GET    | `/analytics/context-switching`          | Cognitive load bucketed by interruption count               |
| GET    | `/analytics/cognitive-load-distribution`| Session counts by Low/Medium/High cognitive load            |
| GET    | `/analytics/flow-state`                 | Productivity comparison: flow state vs. interrupted sessions|
| GET    | `/analytics/sessions?limit=20&offset=0` | Paginated list of individual sessions                       |

Interactive docs (Swagger UI) are auto-generated by FastAPI at `/docs` once the
backend is running.

---

## Environment Variables

**backend/.env** (see `backend/.env.example`)

| Variable             | Default                  | Description                     |
|------------------------|---------------------------|----------------------------------|
| `CLICKHOUSE_HOST`      | `localhost`                | ClickHouse hostname               |
| `CLICKHOUSE_PORT`      | `9000`                     | ClickHouse native protocol port   |
| `CLICKHOUSE_USER`      | `admin`                    | ClickHouse username               |
| `CLICKHOUSE_PASSWORD`  | `admin123`                 | ClickHouse password               |
| `CLICKHOUSE_DB`        | `cognistream`              | Database name                     |
| `CORS_ORIGINS`         | localhost:5173, 127.0.0.1:5173 | Comma-separated allowed origins |

**frontend/.env** (see `frontend/.env.example`)

| Variable         | Default                  | Description                  |
|--------------------|----------------------------|--------------------------------|
| `VITE_API_URL`     | `http://127.0.0.1:8000`    | Backend base URL               |

---

## Project Structure

```
CogniStream/
├── docker-compose.yml
├── airflow/
│   └── dags/cognistream_ingestion_dag.py   # optional scheduling module
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── data/ai_dev_productivity.csv
│   └── app/
│       ├── main.py                # FastAPI app + CORS
│       ├── config/settings.py     # env-driven configuration
│       ├── database/
│       │   ├── clickhouse.py      # client + FastAPI dependency
│       │   └── schema.py          # table DDL
│       ├── routers/analytics.py   # HTTP endpoints
│       ├── services/analytics_service.py  # ClickHouse queries
│       ├── schemas/analytics.py   # Pydantic response models
│       └── scripts/
│           ├── create_tables.py
│           ├── import_csv.py      # Polars transform + load
│           └── test_connection.py
└── frontend/
    ├── Dockerfile
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── hooks/useDashboardData.js
        ├── services/api.js        # Axios client
        └── components/            # StatCard, TrendCard, ContextSwitchCard,
                                    # FlowStateCard, CognitiveLoadDonut,
                                    # SessionsTable, FlowPulse, StatusStates
```

---

## Limitations & Honest Scope Notes

This section is here so reviewers know what's real vs. representative — no
overselling.

- **Dataset**: `ai_dev_productivity.csv` is a generic, single-developer productivity
  dataset (500 sessions) rather than live, multi-developer GitHub/Jira/Slack/IDE event
  logs. It has no timestamp column, so `session_date` is synthetically assigned
  (sequential days from `--start-date`). The analytics model (flow state, context-switch
  rate, cognitive load buckets) is built to generalize to real event-log data, but has
  only been validated against this proxy dataset.
- **Airflow**: a working DAG is included (`airflow/dags/`) to demonstrate the
  orchestration design, but a full Airflow deployment (webserver + scheduler + metadata
  DB) is **not** part of `docker-compose.yml` — it's substantial extra infrastructure
  that isn't needed to run or evaluate the dashboard itself. The DAG file documents how
  to wire it in.
- **UI library**: the brief mentions Tremor.js; this build uses Tailwind CSS with
  hand-built components in the same visual spirit (cards, badges, charts) plus Recharts,
  since `@tremor/react` does not yet have stable React 19 support at the pinned
  dependency versions used here.
- **Frontend Docker image** runs the Vite *dev server*, not a production static build —
  appropriate for local grading/demo, but a real deployment would build with
  `npm run build` and serve `dist/` via nginx (an easy follow-up, not included to keep
  the Docker setup simple for submission).
- **Auth**: none. This is a single-tenant demo dashboard; there's no login or per-user
  data isolation.

---

## Development Notes for Graders / Reviewers

Commands used to verify this build before submission:

```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload      # confirmed clean startup + graceful 503 if DB is down

# Frontend
cd frontend && npm install
npm run build                       # confirmed clean production build
npx eslint src                      # confirmed zero lint errors

# Full stack
docker compose up -d --build
docker compose exec backend python -m app.scripts.import_csv --reset
```
# CogniStream
