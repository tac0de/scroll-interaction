# 중앙일보 브랜드 캠페인 - GSAP Scroll Animation 구조 (강의/교육용)

## 📁 폴더 및 파일 구조

```
scroll-interaction/
├── index.html                # 메인 HTML, <script type="module" src="js/main.js"></script>로 JS 로드
├── js/
│   ├── main.js               # 전체 초기화, 이벤트 바인딩, 애니메이션 리프레시 등 핵심 진입점
│   ├── navigation.js         # 내비게이션(메뉴) 관련 기능
│   ├── share.js              # 카카오/페북/트위터 공유 기능
│   ├── toast.js              # 토스트(알림) 메시지 기능
│   ├── utils.js              # debounce 등 유틸 함수
│   └── animations/           # 각 섹션별 GSAP 애니메이션 모듈
│        ├── entry.js         # 인트로 진입 애니메이션
│        ├── intro.js         # 인트로 메인 애니메이션
│        ├── curation.js      # 큐레이션 섹션 애니메이션
│        ├── event.js         # 이벤트 섹션 애니메이션
│        ├── film.js          # 브랜드 필름 애니메이션
│        ├── mission.js       # 미션 섹션 애니메이션
│        ├── promise.js       # 브랜드 약속 애니메이션
│        └── slogan.js        # 슬로건 섹션 애니메이션
└── README.md                 # (본 파일) 폴더 구조 및 개발 가이드
```

---

## 🚀 주요 개발 포인트

- **모듈화**: 각 애니메이션/기능별로 JS 파일을 분리, main.js에서 일괄 import 및 초기화
- **GSAP/ScrollTrigger**: 모든 애니메이션은 GSAP 및 ScrollTrigger 기반
- **resize 이벤트**: debounce + preWidth 체크로 가로 사이즈 변경 시에만 전체 애니메이션 리프레시
- **initAnimation()**: gsap.globalTimeline.clear(), ScrollTrigger.getAll().forEach(trigger => trigger.kill())로 트리거/타임라인 완전 초기화 후, 각 섹션별 애니메이션 함수 순차 실행
- **index.html**: 직접 작성된 JS 제거, 오직 main.js만 모듈로 로드

---

## 🧑‍💻 확장/학습 가이드

- 새로운 애니메이션 섹션 추가 시, js/animations/에 별도 파일 생성 후 main.js에 import 및 실행 함수 추가
- 유틸 함수는 js/utils.js에 통합 관리
- 네비게이션/공유/토스트 등은 각 기능별로 js/ 하위에 분리 관리
- main.js의 구조(초기화, 이벤트 바인딩, 리프레시 등)는 그대로 유지하며 확장

---

## 🛠️ 외부 의존성

- [GSAP 3.x](https://greensock.com/gsap/)
- [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)
- (공유 기능) 카카오 SDK, 페이스북/트위터 공유 URL

---

## ▶️ 실행 방법

1. index.html을 브라우저에서 오픈
2. (개발 시) js/animations/ 및 js/ 하위 파일 수정 후 새로고침
3. main.js만 모듈로 로드되므로, 별도 빌드 없이 구조 파악 및 실습 가능

---

## 📚 참고/활용 예시

- main.js에서의 import 및 초기화 예시, resize 이벤트 처리, 각 모듈별 함수 작성법 등은 실제 코드 참고
- 강의/실습 시 각 파일별 역할과 확장 방법을 명확히 설명할 것

---

## 라이선스
이 프로젝트는 중앙일보의 브랜드 캠페인을 위한 것으로, 해당 라이선스 정책을 따릅니다. 