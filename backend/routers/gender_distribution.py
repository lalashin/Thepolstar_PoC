from fastapi import APIRouter, Query
import pandas as pd
import numpy as np
import os

router = APIRouter()
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

@router.get("/api/gender-distribution")
def get_gender_distribution(city: str = Query(None, description="Filter by city")):
    """
    남녀부 시청률 분포도 (피라미드 차트) 데이터를 생성합니다.
    - 시청률을 0.2% 단위 구간(Bin)으로 나누어 빈도수를 계산합니다.
    - 남자부는 음수(-), 여자부는 양수(+)로 반환하여 프론트엔드에서 피라미드 형태로 시각화하기 쉽게 합니다.
    - 특정 도시(city)가 선택되면, 해당 도시의 데이터가 전체 분포 내에서 어디에 위치하는지(Highlight) 정보를 별도로 제공할 수 있습니다.
    """
    file_path = os.path.join(DATA_DIR, "V-LEAGUE_2025_Stadium_Updated.csv")
    try:
        df = pd.read_csv(file_path)
        
        # 필수 컬럼 결측 제거
        df = df.dropna(subset=['남여구분', '가구 시청률'])
        if city:
            # 전체 분포는 유지하되, 하이라이팅을 위한 로직이 필요할 수 있으나, 
            # 이번 버전에서는 '도시 필터링 된 분포'를 보여줍니다.
            df = df[df['소속도시'] == city]

        # 구간 설정 (0% ~ 3.0%+, 0.2% 단위)
        bins = np.arange(0, 3.2, 0.2)
        labels = [f"{round(b, 1)}~{round(b+0.2, 1)}%" for b in bins[:-1]]
        
        # 성별 분리
        men_df = df[df['남여구분'] == '남자부']
        women_df = df[df['남여구분'] == '여자부']
        
        # 히스토그램 계산
        men_counts, _ = np.histogram(men_df['가구 시청률'], bins=bins)
        women_counts, _ = np.histogram(women_df['가구 시청률'], bins=bins)
        
        # 데이터 구조화
        data = {
            "labels": labels, # Y축: 시청률 구간
            "men": [int(x) * -1 for x in men_counts], # 좌측 배치 (음수 처리)
            "women": [int(x) for x in women_counts],   # 우측 배치 (양수 처리)
            "maxVal": int(max(max(men_counts), max(women_counts))) # 차트 X축 범위 설정을 위한 최대값
        }
        
        return data

    except Exception as e:
        return {"error": str(e)}
