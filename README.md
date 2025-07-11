# 중앙일보 브랜드 캠페인 - GSAP 애니메이션 모듈화

## 최신 구조 요약 (2024.06)

- **intro_new.js의 모든 기능을 1:1로 js/animations/ 및 js/ 하위로 완전 분리·모듈화**
- **main.js**에서 모든 애니메이션/네비게이션/공유/토스트 모듈을 import 후, DOMContentLoaded 시점에 일괄 초기화
- **resize 이벤트**: `debounce` + `preWidth` 체크로 가로 사이즈 변경 시에만 `initAnimation()`을 호출해 모든 애니메이션을 원본과 동일하게 리프레시
- **initAnimation()**: gsap.globalTimeline.clear(), ScrollTrigger.getAll().forEach(trigger => trigger.kill())로 기존 트리거/타임라인 완전 초기화 후, 각 섹션별 애니메이션 함수 순차 실행
- **navigation.js, share.js, toast.js** 등도 intro_new.js의 원본 로직과 100% 동일하게 분리·이관
- index.html에는 `<script type="module" src="js/main.js"></script>`만 남기고 직접 작성된 JS 제거

---

## main.js 예시 (최신)
```js
import { initEntryAnimation } from './animations/entry.js';
import { initIntroAnimation } from './animations/intro.js';
// ... (생략)
import { initNavigation } from './navigation.js';
import { showToast } from './toast.js';
import { shareToKakao, shareToFacebook, shareToTwitter, copyUrl } from './share.js';
import { debounce } from './utils.js';

let preWidth = window.innerWidth;

function initAnimation() {
    if (window.gsap && window.gsap.globalTimeline) window.gsap.globalTimeline.clear();
    if (window.ScrollTrigger && window.ScrollTrigger.getAll) window.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    initEntryAnimation();
    initIntroAnimation();
    // ... (생략)
    preWidth = window.innerWidth;
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimation();
    // 공유 버튼 이벤트 바인딩 ...
    window.addEventListener('resize', debounce(() => {
        const width = window.innerWidth;
        if (preWidth === width) return;
        initAnimation();
    }, 200));
});
```

---

## 커밋 메시지 추천

```
refactor: intro_new.js 1:1 기준 main.js/모듈 구조 및 resize 애니메이션 리프레시 완전 일치화

- main.js/모듈 구조를 intro_new.js와 100% 동일하게 리팩토링
- resize 시 debounce+preWidth+initAnimation 구조로 애니메이션 리프레시 원본과 일치
- navigation/share/toast 등도 완전 분리 및 1:1 이관
- gsap/ScrollTrigger 초기화 포함, index.html 스크립트 구조도 최신화
```

---

## 라이선스
이 프로젝트는 중앙일보의 브랜드 캠페인을 위한 것으로, 해당 라이선스 정책을 따릅니다. 