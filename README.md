# 중앙일보 브랜드 캠페인 - 모듈화된 구조

## 프로젝트 개요
이 프로젝트는 중앙일보의 브랜드 캠페인 웹사이트를 모듈화하여 재사용 가능한 구조로 리팩토링한 것입니다.

## 프로젝트 구조

```
scroll-interactions/
├── index.html (원본 파일)
├── intro_new.js (원본 파일)
├── index-new.html (리팩토링된 메인 파일)
├── index-components.html (컴포넌트 기반 버전)
├── README.md
├── components/
│   ├── head.html
│   ├── header.html
│   └── sections/
│       ├── entry.html
│       ├── intro.html
│       ├── curation.html
│       ├── slogan.html
│       ├── promise.html
│       ├── mission.html
│       ├── video.html
│       └── share.html
└── js/
    ├── main.js (메인 애플리케이션 파일)
    ├── componentLoader.js (컴포넌트 로더 모듈)
    ├── utils.js (유틸리티 함수)
    ├── toast.js (토스트 알림 모듈)
    ├── share.js (소셜 공유 모듈)
    ├── navigation.js (네비게이션 모듈)
    └── animations/
        ├── entry.js (Entry 섹션 애니메이션)
        ├── intro.js (Intro 섹션 애니메이션)
        ├── curation.js (Curation 섹션 애니메이션)
        ├── slogan.js (Slogan 섹션 애니메이션)
        ├── promise.js (Promise 섹션 애니메이션)
        └── mission.js (Mission 섹션 애니메이션)
```

## 모듈화 구조

### JavaScript 모듈

#### 1. Utils (`js/utils.js`)
- `debounce`: 함수 실행 지연
- `getResponsiveValue`: 반응형 값 계산
- `EASING`: 애니메이션 이징 설정
- `isMobile`, `isDesktop`: 화면 크기 확인
- `isInViewport`: 뷰포트 내 요소 확인
- `$`, `$$`: DOM 선택자 유틸리티

#### 2. Toast (`js/toast.js`)
- `showToast`: 토스트 알림 표시
- `showSuccess`, `showError`, `showWarning`, `showInfo`: 타입별 알림

#### 3. Share (`js/share.js`)
- `copyUrl`: URL 클립보드 복사
- `shareToKakao`: 카카오톡 공유
- `shareToFacebook`: 페이스북 공유
- `shareToTwitter`: 트위터 공유
- `initShare`: 공유 모듈 초기화

#### 4. Navigation (`js/navigation.js`)
- `initNavigation`: 네비게이션 초기화
- `cleanupNavigation`: 네비게이션 정리

#### 5. Component Loader (`js/componentLoader.js`)
- `loadComponent`: 단일 컴포넌트 로드
- `loadComponents`: 여러 컴포넌트 병렬 로드
- `loadAllComponents`: 모든 컴포넌트 로드
- `loadComponentsSequentially`: 순차적 컴포넌트 로드
- `isComponentLoaded`: 컴포넌트 로드 상태 확인
- `unloadComponent`: 컴포넌트 언로드
- `getComponentsStatus`: 모든 컴포넌트 상태 확인

#### 6. Animations (`js/animations/`)
각 섹션별 애니메이션 로직을 분리:
- `entry.js`: 메인 헤드라인 애니메이션
- `intro.js`: 소개 섹션 애니메이션
- `curation.js`: 큐레이션 카드 애니메이션
- `slogan.js`: 슬로건 애니메이션
- `promise.js`: 약속 섹션 애니메이션
- `mission.js`: 미션 섹션 애니메이션

### HTML 컴포넌트

#### 1. Head Component (`components/head.html`)
- 메타 태그, 스타일시트, 스크립트 로드 등 head 섹션 전체

#### 2. Header Component (`components/header.html`)
- 네비게이션 바, 로고, 메뉴 등 헤더 섹션

#### 3. Section Components (`components/sections/`)
- 각 섹션별 HTML 구조를 독립적으로 관리:
  - `entry.html`: 메인 엔트리 섹션
  - `intro.html`: 소개 섹션
  - `curation.html`: 큐레이션 카드 섹션
  - `slogan.html`: 슬로건 섹션
  - `promise.html`: 약속 섹션
  - `mission.html`: 미션 섹션
  - `video.html`: 비디오 섹션
  - `share.html`: 공유 섹션

## 사용 방법

### 1. 기본 사용 (정적 버전)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <!-- head 컴포넌트 내용 -->
    <script src="js/main.js" type="module"></script>
</head>
<body>
    <!-- 메인 콘텐츠 -->
</body>
</html>
```

### 2. 컴포넌트 기반 사용 (동적 로딩)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>컴포넌트 기반 버전</title>
</head>
<body>
    <div id="app-container">
        <div id="header-container"></div>
        <div id="entry-container"></div>
        <!-- 기타 컴포넌트 컨테이너들 -->
    </div>
    
    <script type="module">
        import { loadAllComponents } from './js/componentLoader.js';
        import { initEntryAnimation } from './js/main.js';
        
        // 컴포넌트 로드 후 애니메이션 초기화
        loadAllComponents().then(() => {
            initEntryAnimation();
        });
    </script>
</body>
</html>
```

### 3. 개별 컴포넌트 로딩
```javascript
// 단일 컴포넌트 로드
import { loadComponent } from './js/componentLoader.js';
await loadComponent('header');

// 여러 컴포넌트 병렬 로드
import { loadComponents } from './js/componentLoader.js';
await loadComponents(['header', 'entry', 'intro']);

// 컴포넌트 로드 상태 확인
import { isComponentLoaded } from './js/componentLoader.js';
if (isComponentLoaded('header')) {
    console.log('헤더 컴포넌트가 로드되었습니다');
}
```

### 4. 개별 모듈 사용
```javascript
// Toast 모듈만 사용
import { showToast } from './js/toast.js';
showToast('메시지가 표시됩니다');

// Share 모듈만 사용
import { initShare } from './js/share.js';
initShare({
    kakao: '?utm_source=kakao',
    facebook: '?utm_source=facebook'
});

// 특정 애니메이션만 사용
import { initEntryAnimation } from './js/animations/entry.js';
initEntryAnimation();
```

### 5. 전체 애플리케이션 초기화
```javascript
import { initApp } from './js/main.js';
initApp();
```

## 주요 기능

### 1. 모듈화된 구조
- 각 기능별로 독립적인 모듈
- ES6 모듈 시스템 사용
- 재사용 가능한 컴포넌트
- 동적 컴포넌트 로딩 시스템

### 2. 반응형 지원
- 모바일/데스크톱 대응
- 화면 크기에 따른 적응형 애니메이션

### 3. 접근성 고려
- ARIA 속성 추가
- 키보드 네비게이션 지원
- 스크린 리더 호환성

### 4. 성능 최적화
- 디바운싱을 통한 이벤트 최적화
- 지연 로딩 지원
- 효율적인 DOM 조작

## 사용 가능한 버전

### 1. 기본 버전 (`index-new.html`)
- 정적 HTML 구조
- 모든 콘텐츠가 HTML에 포함
- 빠른 로딩 시간
- SEO 친화적

### 2. 컴포넌트 기반 버전 (`index-components.html`)
- 동적 컴포넌트 로딩
- 모듈화된 구조
- 개발 효율성 향상
- 유지보수성 증대
- 원본 HTML head 섹션 완전 복사 적용
- 기존 중앙일보 시스템과 완전 호환
- 메가메뉴, 검색 등 기존 기능 유지

## 개발 및 배포

### 개발 환경
- ES6+ 모듈 시스템
- GSAP 애니메이션 라이브러리
- 모던 브라우저 지원

### 배포 시 주의사항
1. 모든 모듈 파일이 올바른 경로에 있는지 확인
2. GSAP 라이브러리가 로드되는지 확인
3. type="module" 속성이 올바르게 설정되었는지 확인
4. 컴포넌트 기반 버전 사용 시 모든 HTML 컴포넌트 파일이 올바른 경로에 있는지 확인
5. 동적 로딩을 위한 서버 설정 (CORS 정책 등) 확인

## 브라우저 지원
- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 16+

## 라이선스
이 프로젝트는 중앙일보의 브랜드 캠페인을 위한 것으로, 해당 라이선스 정책을 따릅니다. 