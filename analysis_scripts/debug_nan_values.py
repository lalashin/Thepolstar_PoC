import pandas as pd
df = pd.read_csv('data/V-LEAGUE_2025_Stadium_Updated.csv')
nan_rows = df[df['구단홈구장'].isna()]

print("Unique values in '체육관' column for NaN rows:")
print(nan_rows['체육관'].unique())
