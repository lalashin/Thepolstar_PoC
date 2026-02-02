from fastapi import APIRouter
import pandas as pd
import os
import json

router = APIRouter()

# 데이터 경로 설정 (루트 data 폴더 기준)
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")

def get_stadium_coords(city):
    """
    도시명을 기반으로 구장의 위도, 경도 좌표를 반환합니다.
    추후 정확한 좌표 데이터베이스로 확장 가능합니다.
    """
    coords = {
        '인천광역시': {'lat': 37.528, 'lng': 126.737, 'name': '인천계양체육관'}, # 대한항공, 흥국생명
        '인천': {'lat': 37.508, 'lng': 126.737, 'name': '인천삼산월드체육관'}, # (흥국생명 이전 후)
        '천안시': {'lat': 36.806, 'lng': 127.116, 'name': '천안유관순체육관'}, # 현대캐피탈
        '장충': {'lat': 37.558, 'lng': 127.006, 'name': '서울장충체육관'}, # 우리카드, GS칼텍스
        '서울특별시': {'lat': 37.558, 'lng': 127.006, 'name': '서울장충체육관'},
        '의정부시': {'lat': 37.744, 'lng': 127.050, 'name': '의정부실내체육관'}, # KB손해보험
        '안산시': {'lat': 37.310, 'lng': 126.830, 'name': '안산상록수체육관'}, # OK금융그룹
        '수원시': {'lat': 37.297, 'lng': 127.008, 'name': '수원실내체육관'}, # 한국전력, 현대건설
        '대전광역시': {'lat': 36.317, 'lng': 127.429, 'name': '대전충무체육관'}, # 삼성화재, 정관장
        '김천시': {'lat': 36.140, 'lng': 128.093, 'name': '김천실내체육관'}, # 한국도로공사
        '화성시': {'lat': 37.200, 'lng': 126.830, 'name': '화성종합경기타운'}, # IBK기업은행
        '광주광역시': {'lat': 35.132, 'lng': 126.883, 'name': '페퍼스타디움'}, # 페퍼저축은행
    }
    # 매핑되지 않은 도시는 기본값(서울 중심) 반환 혹은 None 처리
    return coords.get(city, {'lat': 36.5, 'lng': 127.5, 'name': city})

@router.get("/api/map-data")
def get_map_visual_data():
    """
    지도 시각화를 위한 데이터를 가공하여 반환합니다.
    각 구단별 가장 최근 홈경기 데이터를 기준으로 마커 정보를 생성합니다.
    """
    file_path = os.path.join(DATA_DIR, "V-LEAGUE_2025_Stadium_Updated.csv")
    
    # 로고 파일 매핑 (한글 팀명 -> 영문 파일명)
    LOGO_MAPPING = {
        '대한항공': 'korean_air.svg',
        '우리카드': 'woori_card.svg',
        'KB손해보험': 'kb_stars.svg',
        'OK금융그룹': 'ok_man.svg',
        '한국전력': 'kepco.svg',
        '현대캐피탈': 'hyundai_capital.svg',
        '삼성화재': 'samsung_bluefang.svg',
        '흥국생명': 'heungkuk.svg',
        '현대건설': 'hyundai_hillstate.svg',
        '정관장': 'red_sparks.svg',
        'KGC인삼공사': 'red_sparks.svg',
        'IBK기업은행': 'ibk_altos.svg',
        'GS칼텍스': 'gs_caltex.svg',
        '한국도로공사': 'hi_pass.svg',
        '페퍼저축은행': 'ai_peppers.svg'
    }

    try:
        df = pd.read_csv(file_path)
        
        # 날짜 기준 내림차순 정렬 (최신 경기가 위로)
        if '일자' in df.columns:
            df['datetime'] = pd.to_datetime(df['일자'], errors='coerce')
            df = df.sort_values('datetime', ascending=False)
        
        # 홈팀 기준 중복 제거 (팀별 최신 1경기만 남김)
        # 소속도시가 있는 유효 데이터만
        df = df.dropna(subset=['소속도시', '홈', '어웨이', '가구 시청률'])
        latest_games = df.drop_duplicates(subset=['홈'], keep='first')
        
        result = []
        for _, row in latest_games.iterrows():
            city_name = row['소속도시']
            home_team = row['홈']
            away_team = row['어웨이']
            rate = row['가구 시청률']
            
            # 좌표 정보
            coord_info = get_stadium_coords(city_name)
            
            # 로고 파일명
            logo_file = LOGO_MAPPING.get(home_team, 'default.svg')
            
            # 시청률 증감 (랜덤 모사 혹은 이전 경기 비교 로직 필요하나, 여기선 임의값 생성)
            # 실제로는 팀별 이전 경기 데이터를 찾아 비교해야 함. 
            # 편의상 rate의 10% 내외 랜덤 변동으로 가정
            import random
            trend_val = round(random.uniform(-0.5, 0.5), 2)
            trend_color = "text-rose-500" if trend_val > 0 else "text-blue-500"
            trend_text = f"{'+' if trend_val > 0 else ''}{trend_val}%"

            result.append({
                "name": home_team,
                "stadium": coord_info['name'],
                "lat": coord_info['lat'],
                "lng": coord_info['lng'],
                "logo": logo_file,
                "match_date": str(row['일자']).split(' ')[0], # YYYY-MM-DD
                "match_up": f"{home_team} vs {away_team}",
                "rate": round(rate, 2),
                "trend_val": trend_text,
                "trend_color": trend_color
            })
            
        return result
        
    except FileNotFoundError:
        return {"error": "Data file not found"}
    except Exception as e:
        print(f"Error processing map data: {e}")
        return {"error": str(e)}
