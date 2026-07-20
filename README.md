# CogniStream

**Developer Flow-State & Cognitive Load Analytics Platform**

[![Status](https://img.shields.io/badge/status-submission--ready-2DD4BF?style=for-the-badge)](https://github.com/Kunalray0707/CogniStream)
[![Tech Stack](https://img.shields.io/badge/stack-FastAPI%20%7C%20React%20%7C%20ClickHouse%20%7C%20Polars-informational?style=for-the-badge)](https://github.com/Kunalray0707/CogniStream)

CogniStream shifts engineering analytics away from superficial activity counters (like "lines of code" or "PR count") toward **developer friction metrics**: tracking cognitive load, interruptions, deep focus sessions (flow state), and quantifying the **Context-Switching Tax** on productivity.

> Engineering managers gain actionable visibility into *why* velocity fluctuates — identifying high-interruption friction zones and overload states before burnout occurs.

---

## 📸 Screenshots

<!-- Replace placeholders with actual app screenshots after running locally -->
| Full Analytics Dashboard | Cognitive Load & Context Switching |
| :---: | :---: |
| `docs/screenshot-dashboard.png` | `docs/screenshot-analytics.png` |

---

## 🏗️ Architecture

```
┌─────────────────┐       HTTP / REST       ┌───────────────────┐      ClickHouse TCP     ┌────────────────┐
│  React 19 + Vite │ ─────────────────────► │   FastAPI Backend │ ──────────────────► │  ClickHouse    │
│  Tailwind CSS   │ ◄───────────────────── │   (app/main.py)   │ ◄────────────────── │  OLAP DB       │
│  Recharts       │                         └───────────────────┘                     └────────────────┘
└─────────────────┘                                   ▲
                                                      │ Transformed Data Load
                                            ┌───────────────────┐
                                            │  Polars Ingestion │
                                            │  (import_csv.py)  │
                                            └───────────────────┘
                                                      ▲
                                                      │ Raw Event Source
                                            ┌───────────────────┐
                                            │  ai_dev_          │
                                            │  productivity.csv │
                                            └───────────────────┘
```

### Data Pipeline & Schema Design
1. **Raw Activity Dataset**: Reads raw session data (`ai_dev_productivity.csv`).
2. **Polars Ingestion Engine**: High-performance transformations derive metrics:
   - `context_switch_rate`: Interruptions per coding hour ($distractions / \max(hours, 0.01)$).
   - `flow_state`: Deep flow boolean ($\ge 3$ coding hours AND $\le 2$ distractions).
   - `productivity_score`: Composite outcome score ($0 - 100$).
   - `cognitive_load_level`: Low ($\le 4$), Medium ($4-7$), High ($>7$).
3. **ClickHouse OLAP Storage**:
   - `developers`: Developer profile registry.
   - `coding_sessions`: High-granularity session event logs.
   - `cognitive_metrics`: Correlated cognitive load, task success, and recommendations.

---

## 🛠️ Technology Stack

| Layer | Component | Technology |
|---|---|---|
| **Frontend** | Framework | React 19, Vite |
| | Styling | Tailwind CSS (Tremor UI aesthetic palette) |
| | Charts & Visuals | Recharts |
| | HTTP Client | Axios |
| **Backend** | API Server | FastAPI (Python 3.12), Pydantic |
| | Web Server | Uvicorn |
| **Database** | OLAP Database | ClickHouse Columnar Store |
| | Python Driver | `clickhouse-driver` |
| **Data Processing** | ETL / Analysis | Polars |
| **Infrastructure** | Containerization | Docker & Docker Compose |
| **Orchestration** | Scheduled Pipeline | Apache Airflow (Optional DAG included) |

---

## ✨ Key Features

- **Dashboard KPI Cards**: Instant breakdown of total sessions, average cognitive load index, task success rate, and flow state percentage.
- **Cognitive Load vs. Productivity Trend**: Dual-axis line chart tracking daily average load against productivity over time.
- **The Context-Switching Tax**: Bar chart categorizing cognitive load impact across interruption buckets ($0$, $1-2$, $3-4$, $5+$ distractions).
- **Flow State Impact**: Comparative analysis between deep flow sessions vs. interrupted sessions.
- **Cognitive Load Mix**: Donut chart visualizer for session distribution across Low, Medium, and High load tiers.
- **Interactive Coding Sessions Table**: Filterable by cognitive load level with hover recommendations, real-time status indicators, and CSV report export.
- **Zero-Config Auto-Seeding**: Automatic initialization and dataset ingestion on first launch.

---

## 🚀 Getting Started

### Method 1 — Docker Compose (Recommended)

Run the full production-ready stack in containers with one command:

```bash
git clone https://github.com/Kunalray0707/CogniStream.git
cd CogniStream

docker compose up -d --build
```

The stack automatically boots ClickHouse, initializes schema tables, auto-seeds the initial dataset if empty, and launches both backend and frontend services.

Access endpoints:
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **FastAPI OpenAPI Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ClickHouse HTTP Interface**: [http://localhost:8123](http://localhost:8123)

To manually re-seed or reset the database via Docker:
```bash
docker compose exec backend python -m app.scripts.import_csv --reset
```

---

### Method 2 — Local Development Setup

#### 1. Start ClickHouse Container
```bash
docker run -d --name cognistream-clickhouse \
  -p 8123:8123 -p 9000:9000 \
  -e CLICKHOUSE_DB=cognistream \
  -e CLICKHOUSE_USER=admin \
  -e CLICKHOUSE_PASSWORD=admin123 \
  clickhouse/clickhouse-server:24.8
```

#### 2. Run FastAPI Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Create tables and load data
python -m app.scripts.create_tables

# Start server
uvicorn app.main:app --reload --port 8000
```

#### 3. Run React Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/` | API status & welcome message | None |
| `GET` | `/health` | System health check | None |
| `GET` | `/analytics/dashboard` | Top-level KPI metrics summary | None |
| `GET` | `/analytics/developers` | Developer profile overview & aggregate metrics | None |
| `GET` | `/analytics/trend` | Time-series data for line charts | `limit` (default: 30) |
| `GET` | `/analytics/context-switching` | Context-switching tax by distraction count | None |
| `GET` | `/analytics/cognitive-load-distribution` | Distribution mix (Low/Medium/High) | None |
| `GET` | `/analytics/flow-state` | Flow vs. Interrupted session performance | None |
| `GET` | `/analytics/sessions` | Paginated session log records | `limit`, `offset`, `load_level`, `flow_only` |

---

## 📁 Directory Structure

```
CogniStream/
├── docker-compose.yml             # Orchestrates ClickHouse, Backend, Frontend
├── docker-compose.airflow.yml     # Optional Apache Airflow compose extension
├── .gitignore                     # Clean repository filter rules
├── README.md                      # Documentation & submission guide
├── airflow/
│   └── dags/
│       └── cognistream_ingestion_dag.py # Apache Airflow DAG
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   ├── data/
│   │   └── ai_dev_productivity.csv # Source dataset
│   └── app/
│       ├── main.py                # FastAPI app lifecycle & CORS
│       ├── config/
│       │   └── settings.py        # Centralized environment settings
│       ├── database/
│       │   ├── clickhouse.py      # ClickHouse client & dependency
│       │   └── schema.py          # ClickHouse DDL definitions
│       ├── routers/
│       │   └── analytics.py       # REST API Endpoints
│       ├── services/
│       │   └── analytics_service.py # ClickHouse SQL analytics logic
│       ├── schemas/
│       │   └── analytics.py       # Pydantic data schemas
│       └── scripts/
│           ├── create_tables.py   # DDL runner & auto-seeder
│           ├── import_csv.py      # Polars ETL transformer & ClickHouse loader
│           └── test_connection.py # Health diagnostic script
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                # Main Dashboard View
        ├── index.css              # Custom styling & scrollbar
        ├── services/
        │   └── api.js             # Axios API client
        ├── hooks/
        │   └── useDashboardData.js # Custom hook for async state management
        └── components/
            ├── StatCard.jsx
            ├── TrendCard.jsx
            ├── ContextSwitchCard.jsx
            ├── FlowStateCard.jsx
            ├── CognitiveLoadDonut.jsx
            ├── SessionsTable.jsx
            ├── FlowPulse.jsx
            └── StatusStates.jsx
```

---

## 🧪 Verification & Testing

Verify system integrity locally before submission:

```bash
# 1. Test Frontend Production Build
cd frontend
npm run build

# 2. Test Backend Python Imports & Scripts
cd ../backend
python -m app.scripts.test_connection
python -m app.scripts.create_tables

# 3. Test Docker End-to-End
cd ..
docker compose up -d --build
```

---

## 📝 GitHub Commit Suggestions

Use clean conventional commit messages when pushing to GitHub:

- `feat(backend): add automatic startup table initialization and csv data auto-seeding`
- `feat(frontend): add interactive cognitive load filtering and CSV report export`
- `fix(cors): expand allowed origin hosts for seamless local development`
- `docs: update submission-ready README with architecture diagram and API reference`

---

## 📄 License & Academic Submission Note
Developed for **CogniStream – Developer Flow-State & Cognitive Load Analytics** project submission.
