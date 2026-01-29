# 생성하신 파일을 불러와서 분석해보기
import pandas as pd

df = pd.read_csv('data/V-LEAGUE_2025_Stadium_Updated.csv')

# 1. 도시별 평균 시청률 (가구 시청률 기준)
city_rating = df.groupby('소속도시')['가구 시청률'].mean().sort_values(ascending=False)

print("--- 도시별 평균 시청률 순위 ---")
print(city_rating)

# 2. 가장 시청률이 높았던 홈구장 TOP 3
stadium_rating = df.groupby('구단홈구장')['가구 시청률'].mean().sort_values(ascending=False)

print("\n--- 홈구장별 평균 시청률 TOP 3 ---")
print(stadium_rating.head(3))