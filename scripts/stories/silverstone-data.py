"""Builds src/data/stories/silverstone.json for the interactive Silverstone story.

Every number on that page comes from the processed outputs of github.com/srohitsuryaa21/SOC-Silverstone-2026.
Usage: python scripts/stories/silverstone-data.py <path to a clone of SOC-Silverstone-2026>
"""
import json
import sys
from pathlib import Path

import pandas as pd

repo = Path(sys.argv[1]) / 'data' / 'processed'
out = Path(__file__).resolve().parents[2] / 'src' / 'data' / 'stories' / 'silverstone.json'

metrics = pd.read_csv(repo / 'deployment_lap_straight_metrics.csv')
summary = pd.read_csv(repo / 'deployment_summary.csv')
merged = pd.read_csv(repo / 'deployment_tyre_merged.csv')

# tyre stints: deployment proxy (speed 100 m before the end of each straight) against tyre degradation slope
stints = [
    {'s': r.Session, 'd': r.Driver, 't': r.Team, 'c': r.Compound, 'v': round(r.deployment_reference_speed_kmh, 2), 'g': round(r.deg_slope_s_per_lap, 3)}
    for r in merged.itertuples()
]
corr = lambda df: round(float(df.deployment_reference_speed_kmh.corr(df.deg_slope_s_per_lap)), 4)
by_session = {s: {'r': corr(g), 'n': int(len(g))} for s, g in merged.groupby('Session') if len(g) > 2}

# straights: how often the speed stalled while the driver was still flat out, and for how long
straights = []
for name, g in metrics.groupby('straight', sort=False):
    straights.append({
        'name': name,
        'start': int(g.straight_start_m.iloc[0]),
        'end': int(g.straight_end_m.iloc[0]),
        'ref': round(float(g.reference_speed_kmh.mean()), 1),
        'max': round(float(g.max_speed_kmh.mean()), 1),
        'derateMs': round(float(g.derating_duration_ms.mean())),
        'derateShare': round(float(g.derating_flag.mean()), 3),
    })

# teammates over the weekend: mean deployment proxy per driver, gap between the two drivers of each team
drivers = summary.groupby('Driver').agg(v=('reference_speed_kmh', 'mean'), t=('Team', 'first'))
teammates = []
for team, g in drivers.groupby('t'):
    g = g.sort_values('v', ascending=False)
    if len(g) < 2:
        continue
    teammates.append({'team': team, 'lead': g.index[0], 'other': g.index[1], 'gap': round(float(g.v.iloc[0] - g.v.iloc[1]), 2)})
teammates.sort(key=lambda x: -x['gap'])

data = {
    'source': 'github.com/srohitsuryaa21/SOC-Silverstone-2026',
    'r': corr(merged),
    'stintCount': int(len(merged)),
    'bySession': by_session,
    'derateShare': round(float(metrics.derating_flag.mean()), 3),
    'runs': int(len(metrics)),
    'straights': straights,
    'teammates': teammates,
    'stints': stints,
}
out.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(out, len(stints), 'stints', data['r'], by_session, data['derateShare'])
