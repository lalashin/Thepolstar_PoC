import pandas as pd

# 데이터 로드
df = pd.read_csv('data/V-LEAGUE_2025_Stadium_Updated.csv')

# --- 데이터 전처리 ---
# 구단홈구장 또는 소속도시 정보가 없는(NaN) 행은 분석에서 제외
df_clean = df.dropna(subset=['구단홈구장', '소속도시'])

# 1. 도시별 평균 시청률 (전체 출력)
city_rating = df_clean.groupby('소속도시')['가구 시청률'].mean().sort_values(ascending=False)

print("\n" + "="*20 + " 도시별 평균 시청률 (전체 순위) " + "="*20)
print(city_rating)

# 2. 홈구장별 평균 시청률 (전체 출력)
stadium_rating = df_clean.groupby('구단홈구장')['가구 시청률'].mean().sort_values(ascending=False)

print("\n" + "="*20 + " 홈구장별 평균 시청률 (전체 순위) " + "="*20)
print(stadium_rating)

# 3. 상세 리스트 (시청률 순)
print("\n" + "="*20 + " 전체 경기 상세 리스트 (시청률 순) " + "="*20)

target_cols = ['구단홈구장', '소속도시', '가구 시청률']
# 날짜 컬럼 자동 찾기
date_col = [c for c in df_clean.columns if '일' in c or 'Date' in c or 'date' in c]
if date_col:
    target_cols = [date_col[0]] + target_cols

result_df = df_clean[target_cols].sort_values(by='가구 시청률', ascending=False)

# 전체 출력 설정
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

print(result_df)
