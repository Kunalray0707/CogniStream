# 🧠 CogniStream

<div align="center">

# Developer Flow-State & Cognitive Load Analytics Platform

### Measure Developer Productivity Beyond Commits & Lines of Code

An Enterprise-Grade **Data Engineering**, **Data Analytics**, and **Business Intelligence** platform that analyzes developer behavior, measures cognitive load, identifies productivity bottlenecks, and visualizes engineering insights through an interactive analytics dashboard.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![ClickHouse](https://img.shields.io/badge/ClickHouse-OLAP-FFCC01)
![Apache Airflow](https://img.shields.io/badge/Airflow-Orchestration-017CEE?logo=apacheairflow)
![Polars](https://img.shields.io/badge/Polars-Data_Processing-purple)
![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-success)

</div>

---

# 📌 Overview

Traditional engineering metrics like:

- Lines of Code
- Number of Commits
- Closed Tickets
- Pull Requests

only measure **output**.

They don't explain **why productivity decreases**.

**CogniStream** solves this problem by measuring developer behavior and identifying the real causes of productivity loss.

Instead of asking

> "How many commits did a developer push?"

CogniStream answers

- 🧠 How long developers stay in Deep Focus?
- ⚡ How much Context Switching reduces productivity?
- 🔔 Which notifications interrupt coding sessions?
- 📊 What causes Cognitive Overload?
- 🚀 Which developers experience the highest Flow State?

---

# 🎯 Business Problem

Engineering teams are constantly interrupted by

- Slack notifications
- Jira updates
- Meetings
- CI/CD alerts
- Context switching

These interruptions reduce deep work and increase cognitive load.

CogniStream transforms raw developer activity into actionable business intelligence that Engineering Managers can use to improve developer experience and team productivity.

---

# ✨ Key Features

## 📊 Executive Dashboard

- Flow Score
- Productivity Score
- Cognitive Load Score
- Context Switching Tax
- Average Focus Time
- Longest Flow Session
- Coding Hours
- Active Developers

---

## 📈 Engineering Analytics

- Daily Productivity Trend
- Weekly Flow State Trend
- Monthly Coding Activity
- Developer Performance
- IDE Usage Analytics
- Commit Timeline
- Working Hours Analysis

---

## 🧠 Cognitive Analytics

- Cognitive Load Distribution
- Deep Focus Detection
- Context Switching Timeline
- Productivity vs Cognitive Load
- Interruption Analysis
- Session Analytics

---

## ⚡ Developer Experience Analytics

- Notification Frequency
- Slack Interruptions
- Jira Interruptions
- Coding Session Length
- Focus Blocks
- Flow State Detection

---

# 📊 Dashboard Visualizations

The dashboard provides multiple interactive business intelligence charts.

### 📈 Line Charts

- Productivity Trend
- Flow State Trend
- Coding Hours Trend
- Cognitive Load Trend

### 📊 Bar Charts

- Commits by Developer
- Coding Hours
- Interruptions by Source
- Jira Ticket Activity
- Daily Sessions

### 🥧 Pie Charts

- Cognitive Load Distribution
- Notification Sources
- Developer Activity Distribution

### 📉 Area Charts

- Flow State Timeline
- Coding Activity

### 🔥 Heatmaps

- Weekly Coding Heatmap
- IDE Activity Heatmap
- Productivity Calendar

### 📍 Scatter Charts

- Productivity vs Cognitive Load

### ⚡ Gauge Charts

- Flow Score
- Productivity Score
- Developer Efficiency

### 📅 Timeline Charts

- Context Switching Timeline
- Developer Activity Timeline

---

# 🏗 System Architecture

```
                   GitHub API
                       │
                   Slack API
                       │
                    Jira API
                       │
                VS Code Activity
                       │
────────────────────────────────────────
             Python Data Extraction
────────────────────────────────────────
                       │
                       ▼
             Apache Airflow Scheduler
                       │
                       ▼
          Polars ETL Data Processing
                       │
                       ▼
        ClickHouse OLAP Data Warehouse
                       │
                       ▼
            FastAPI Analytics Service
                       │
                       ▼
       React Analytics Dashboard
```

---

# 🔄 Data Engineering Pipeline

```
Raw Event Logs

        │

        ▼

Python Extractors

        │

        ▼

Apache Airflow

        │

        ▼

Polars Data Cleaning

        │

        ▼

Feature Engineering

        │

        ▼

ClickHouse OLAP Database

        │

        ▼

FastAPI REST API

        │

        ▼

React Dashboard
```

---

# 📊 Data Analysis Techniques

This project demonstrates:

- Time-Series Analysis
- Behavioral Analytics
- Session Analysis
- Event Correlation
- KPI Design
- Trend Analysis
- Statistical Aggregation
- Context Switching Detection
- Flow State Detection
- Productivity Scoring
- Data Visualization
- Engineering Analytics

---

# 🛠 Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React 19, Vite, Tailwind CSS, Recharts, Axios |
| Backend | FastAPI, Python |
| Database | ClickHouse |
| Data Processing | Polars |
| Scheduling | Apache Airflow |
| Containerization | Docker, Docker Compose |
| Version Control | Git & GitHub |

---

# 📁 Project Structure

```
CogniStream/

│

├── airflow/

│ └── dags/

│

├── backend/

│ ├── app/

│ ├── routers/

│ ├── services/

│ ├── database/

│ ├── schemas/

│ └── scripts/

│

├── frontend/

│ ├── src/

│ ├── components/

│ ├── pages/

│ ├── hooks/

│ └── services/

│

├── database/

├── docker/

├── docs/

├── mock_data/

├── tests/

├── docker-compose.yml

└── README.md
```

---

# 📊 Dataset

CogniStream processes developer activity from multiple sources including

- GitHub Commits
- Pull Requests
- Slack Messages
- Jira Issues
- VS Code Activity
- Coding Sessions
- Notifications
- Context Switch Events

The ETL pipeline converts raw event logs into an optimized analytical dataset for ClickHouse.

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Kunalray0707/CogniStream.git

cd CogniStream
```

---

## Start with Docker

```bash
docker compose up -d --build
```

---

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Open Application

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

# 📡 REST API

| Endpoint | Description |
|------------|------------------------------|
| /analytics/dashboard | Dashboard KPIs |
| /analytics/trend | Productivity Trends |
| /analytics/context-switching | Context Switching Analytics |
| /analytics/flow-state | Flow State Analysis |
| /analytics/cognitive-load | Cognitive Load Distribution |
| /analytics/sessions | Developer Sessions |

---

# 📈 Business KPIs

The dashboard measures

- Flow Score
- Productivity Score
- Context Switching Tax
- Deep Focus Time
- Average Session Duration
- Daily Coding Hours
- Interruptions
- Notification Frequency
- Developer Efficiency
- Cognitive Load Index

---

# 📊 Business Intelligence Insights

CogniStream helps Engineering Managers answer:

- Which developers lose the most focus?
- Which notifications reduce productivity?
- What is the average Flow State?
- How much productivity is lost due to context switching?
- Which teams maintain the highest coding efficiency?
- What are the peak coding hours?
- Which activities consume the most developer time?

---

# 💡 Future Enhancements

- Kafka Real-Time Streaming
- Snowflake Data Warehouse
- dbt Transformations
- Machine Learning Predictions
- Burnout Prediction
- AI Productivity Recommendations
- LLM Developer Assistant
- Power BI Dashboard
- Grafana Monitoring
- Team Benchmark Analytics

---

# 🎯 Skills Demonstrated

## Data Engineering

- Apache Airflow
- ClickHouse
- Polars
- ETL Pipelines
- Data Modeling
- Docker

## Backend

- Python
- FastAPI
- REST APIs

## Frontend

- React
- Tailwind CSS
- Recharts
- Axios

## Analytics

- Business Intelligence
- Dashboard Design
- KPI Development
- Data Visualization
- Time-Series Analysis
- Behavioral Analytics
- Productivity Analytics

## DevOps

- Docker
- Docker Compose
- Git
- GitHub

---

# 📚 Learning Outcomes

This project demonstrates practical experience in

- Building enterprise-grade ETL pipelines
- Designing OLAP databases
- Developing REST APIs
- Creating interactive analytics dashboards
- Processing large event datasets
- Building Business Intelligence applications
- Engineering Productivity Analytics

---

# 👨‍💻 Author

**Kunal Ray**

GitHub

https://github.com/Kunalray0707

Project Repository

https://github.com/Kunalray0707/CogniStream

---

# ⭐ Support

If you found this project useful,

⭐ Star this repository on GitHub.

It helps the project reach more developers and supports future improvements.

---

## 📜 License

This project is released under the **MIT License**.
