import pandas as pd
import sys

# 기본 설정 (터미널 인자가 없을 때 사용)
DEFAULT_TEAM = "흥국생명"
DEFAULT_SEASON = None  # 전체 시즌

def show_team_stats(team_name, season=None):
    # 데이터 로드
    try:
        df = pd.read_csv('data/V-LEAGUE_2025_Stadium_Updated.csv')
    except FileNotFoundError:
        print("오류: 데이터 파일을 찾을 수 없습니다.")
        return

    # 홈 팀 기준으로 필터링
    filtered_df = df[df['홈'] == team_name].copy()
    
    # 시즌 필터링
    if season:
        filtered_df = filtered_df[filtered_df['시즌'] == season]
    
    # 결과 출력 시작
    print(f"\n{'='*50}")
    print(f"  [{team_name}] 상세 분석 리포트")
    print(f"{'='*50}")
    
    if season:
        print(f"▶ 대상 시즌: {season}")
    else:
        print(f"▶ 대상 시즌: 전체 데이터")

    if filtered_df.empty:
        print("\n[알림] 해당 조건에 맞는 경기 데이터가 없습니다.")
        print(f"       팀명이나 시즌을 확인해주세요. (입력된 팀: {team_name})")
        return

    # 주요 통계 계산
    match_count = len(filtered_df)
    avg_rating = filtered_df['가구 시청률'].mean()
    max_rating = filtered_df['가구 시청률'].max()
    min_rating = filtered_df['가구 시청률'].min()
    
    # 시청률 1위 경기 정보 찾기
    best_match = filtered_df.loc[filtered_df['가구 시청률'].idxmax()]

    print(f"▶ 총 경기 수: {match_count} 경기")
    print(f"▶ 평균 시청률: {avg_rating:.5f}%")
    print(f"▶ 최고 시청률: {max_rating:.5f}%  (vs {best_match['어웨이']}, {best_match['일자']})")
    print(f"▶ 최저 시청률: {min_rating:.5f}%")
    
    print("-" * 50)
    print(" [상세 경기 리스트 (최신순)]")
    print("-" * 50)
    
    # 출력할 컬럼 정의
    cols = ['일자', '시즌', '라운드구분', '홈', '어웨이', '구단홈구장', '가구 시청률']
    
    # 날짜 기준 내림차순 정렬
    filtered_df = filtered_df.sort_values(by='일자', ascending=False)
    
    # pandas 출력 옵션 (잘림 방지)
    pd.set_option('display.max_rows', None)
    pd.set_option('display.width', 1000)
    
    # 인덱스 없이 깔끔하게 출력
    print(filtered_df[cols].to_string(index=False))
    print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    # 사용자가 코드를 직접 수정해서 쓸 수도 있고, 
    # 나중에 기능을 확장할 수도 있게 구조화함.
    
    # 현재 설정된 타겟 실행
    show_team_stats(DEFAULT_TEAM, DEFAULT_SEASON)
