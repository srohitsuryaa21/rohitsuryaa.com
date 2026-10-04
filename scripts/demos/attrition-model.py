"""Trains the small model behind the "try it" demo on the Employee Attrition page.

Data: the original IBM HR Analytics dataset (1,470 employees), IBM's public copy.
A logistic regression on eight features people can picture, so the browser can run it and explain it.
Writes src/data/demos/attrition.json: means, scales and coefficients, plus the model's own cross validated AUC.
"""
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

URL = 'https://raw.githubusercontent.com/IBM/employee-attrition-aif360/master/data/emp_attrition.csv'
out = Path(__file__).resolve().parents[2] / 'src' / 'data' / 'demos' / 'attrition.json'

df = pd.read_csv(URL, encoding='utf-8-sig')
X = pd.DataFrame({
    'overtime': (df.OverTime == 'Yes').astype(float),
    'income': df.MonthlyIncome / 1000,              # thousands per month
    'age': df.Age.astype(float),
    'years': df.YearsAtCompany.astype(float),
    'travel': df.BusinessTravel.map({'Non-Travel': 0, 'Travel_Rarely': 1, 'Travel_Frequently': 2}).astype(float),
    'single': (df.MaritalStatus == 'Single').astype(float),
    'satisfaction': df.JobSatisfaction.astype(float),  # 1 to 4
    'distance': df.DistanceFromHome.astype(float),  # km
})
y = (df.Attrition == 'Yes').astype(int)

pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
cv = cross_val_score(pipe, X, y, cv=StratifiedKFold(5, shuffle=True, random_state=42), scoring='roc_auc')
pipe.fit(X, y)
sc, lr = pipe[0], pipe[1]

data = {
    'source': 'IBM HR Analytics Employee Attrition (1,470 employees), ' + URL,
    'auc': round(float(cv.mean()), 3),
    'rows': int(len(df)),
    'baseRate': round(float(y.mean()), 4),
    'intercept': float(lr.intercept_[0]),
    'features': [
        {'key': k, 'mean': float(m), 'scale': float(s), 'coef': float(c),
         'min': float(X[k].min()), 'max': float(X[k].max()), 'median': float(X[k].median())}
        for k, m, s, c in zip(X.columns, sc.mean_, sc.scale_, lr.coef_[0])
    ],
}
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(data, indent=1), encoding='utf-8')
print('cv auc', cv.round(3), data['auc'])
for f in data['features']:
    print(f"{f['key']:>12} coef {f['coef']:+.3f}  median {f['median']}")
