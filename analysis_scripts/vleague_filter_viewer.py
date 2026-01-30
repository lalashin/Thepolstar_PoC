import pandas as pd

# --- 설정 (이 부분을 수정하여 원하는 구단과 시즌을 선택하세요) ---
TARGET_TEAM = "대한항공"  # 보고 싶은 홈 구단명 (예: '대한항공', '현대캐피탈', '흥국생명' 등)
TARGET_SEASON = None     # 특정 시즌만 보려면 "2021-2022" 처럼 입력. 전체 시즌은 None

# 데이터 로드
df = pd.read_csv('data/V-LEAGUE_2025_Stadium_Updated.csv')

# --- 필터링 로직 ---
# 1. 홈 구단 필터링 (홈팀 기준)
filtered_df = df[df['홈'] == TARGET_TEAM].copy()

# 2. 시즌 필터링 (설정된 경우만)
if TARGET_SEASON:
    filtered_df = filtered_df[filtered_df['시즌'] == TARGET_SEASON]

# --- 결과 출력 ---
print(f"\n[{TARGET_TEAM}] 팀 분석 레포트")
if TARGET_SEASON:
    print(f"대상 시즌: {TARGET_SEASON}")
else:
    print("대상 시즌: 전체 기간")

print(f"총 경기 수: {len(filtered_df)}게임")

# 평균 시청률 계산
if not filtered_df.empty:
    avg_rate = filtered_df['가구 시청률'].mean()
    print(f"평균 시청률: {avg_rate:.5f}%")
    
    # 최고 시청률 경기
    best_match = filtered_df.loc[filtered_df['가구 시청률'].idxmax()]
    print(f"\n★ 최고 시청률 경기:")
    print(f"   일자: {best_match['일자']} ({best_match['요일']})")
    print(f"   상대: {best_match['어웨이']}")
    print(f"   결과: {best_match['가구 시청률']:.5f}%")
    
    print("\n" + "="*60)
    print("상세 경기 리스트 (최신순)")
    print("="*60)
    
    # 보고 싶은 컬럼만 선택
    display_cols = ['일자', '시즌', '라운드구분', '홈', '어웨이', '구단홈구장', '가구 시청률']
    
    # 날짜 내림차순 정렬
    filtered_df = filtered_df.sort_values(by='일자', ascending=False)
    
    pd.set_option('display.max_rows', None)
    pd.set_option('display.width', 1000)
    
    # 인덱스 숨기고 출력 (to_string index=False는 깔끔하게 보임)
    print(filtered_df[display_cols].to_string(index=False))

else:
    print("\n해당 조건의 경기 데이터가 없습니다.")
