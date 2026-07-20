-- =====================================================================
-- CogniStream - ClickHouse OLAP Analytical Query Suite
-- =====================================================================

-- 1. Context-Switching Tax Aggregates
-- Measures how distractions impact average cognitive load and productivity score.
SELECT
    multiIf(
        cs.distractions = 0, '0 Interruptions',
        cs.distractions <= 2, '1-2 Interruptions',
        cs.distractions <= 4, '3-4 Interruptions',
        '5+ Interruptions'
    ) AS distraction_category,
    count() AS total_sessions,
    round(avg(cm.cognitive_load), 2) AS avg_cognitive_load,
    round(avg(cm.productivity_score), 2) AS avg_productivity_score,
    round(avg(cs.context_switch_rate), 2) AS avg_context_switch_rate
FROM coding_sessions cs
INNER JOIN cognitive_metrics cm ON cs.id = cm.session_id
GROUP BY distraction_category
ORDER BY avg_cognitive_load ASC;


-- 2. Deep Flow State Efficiency Index
-- Compares sessions in deep flow (>=3 coding hrs & <=2 distractions) vs interrupted sessions.
SELECT
    cs.flow_state,
    count() AS session_count,
    round(avg(cs.hours_coding), 2) AS avg_hours_coded,
    round(avg(cs.commits), 2) AS avg_commits,
    round(avg(cs.bugs_reported), 2) AS avg_bugs,
    round(avg(cm.productivity_score), 2) AS avg_productivity_score
FROM coding_sessions cs
INNER JOIN cognitive_metrics cm ON cs.id = cm.session_id
GROUP BY cs.flow_state
ORDER BY cs.flow_state DESC;


-- 3. Developer Burnout Risk Profiling
-- Identifies sessions with high cognitive load (>7.0) combined with elevated context switching.
SELECT
    cs.id AS session_id,
    cs.session_date,
    cs.hours_coding,
    cs.distractions,
    cm.cognitive_load,
    cm.cognitive_load_level,
    cm.recommendation
FROM coding_sessions cs
INNER JOIN cognitive_metrics cm ON cs.id = cm.session_id
WHERE cm.cognitive_load > 7.0 OR cs.distractions >= 5
ORDER BY cm.cognitive_load DESC, cs.distractions DESC
LIMIT 50;


-- 4. Cognitive Load Distribution Mix
-- Calculates percentage distribution across Low, Medium, and High load tiers.
SELECT
    cm.cognitive_load_level,
    count() AS total_sessions,
    round((count() * 100.0) / (SELECT count() FROM cognitive_metrics), 2) AS percentage_of_total
FROM cognitive_metrics cm
GROUP BY cm.cognitive_load_level
ORDER BY total_sessions DESC;


-- 5. Daily 7-Day Moving Averages
-- Calculates 7-day rolling average of cognitive load and productivity.
SELECT
    cs.session_date,
    round(avg(cm.cognitive_load) OVER (ORDER BY cs.session_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS rolling_avg_load,
    round(avg(cm.productivity_score) OVER (ORDER BY cs.session_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS rolling_avg_productivity
FROM coding_sessions cs
INNER JOIN cognitive_metrics cm ON cs.id = cm.session_id
ORDER BY cs.session_date DESC
LIMIT 30;
