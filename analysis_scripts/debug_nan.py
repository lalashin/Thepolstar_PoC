import pandas as pd
df = pd.read_csv('data/V-LEAGUE_2025_Stadium_Updated.csv')
nan_rows = df[df['구단홈구장'].isna()]
print("NaN Columns:", df.columns.tolist())
# Assuming '홈팀' exists, if not I'll see invalid index error but I'll try to find team column
# Common column names: '홈팀', 'Home Team', '팀명', etc.
# Based on common structures, let's look for likely team name columns
possible_team_cols = [c for c in df.columns if '팀' in c or 'Team' in c]
cols_to_show = ['일자'] + possible_team_cols + ['구단홈구장', '소속도시']
print(nan_rows[cols_to_show].head(10))
