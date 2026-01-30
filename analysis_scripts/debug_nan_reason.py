import pandas as pd
df = pd.read_csv('data/V-LEAGUE_2025_Stadium_Updated.csv')
nan_rows = df[df['구단홈구장'].isna()]

# Identify the column that contains the raw stadium name.
# It's likely strictly before '소속도시'
print("Sample NaN Rows with Context:")
# Try to find a column that looks like a stadium name
# Based on previous output, column might be '체육관' or '경기장'
possible_stadium_cols = [c for c in df.columns if '체육관' in c or '경기장' in c]
cols = ['일자', '라운드구분'] + possible_stadium_cols + ['구단홈구장']
print(nan_rows[cols].head(10))
