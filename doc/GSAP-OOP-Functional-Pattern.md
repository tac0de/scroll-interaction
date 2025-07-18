# GSAP OOP + 함수형 헬퍼 패턴 가이드

## 1. 개요
- 모든 섹션 애니메이션을 **OOP(SectionAnimationBase 추상클래스) + 함수형 헬퍼(시나리오 step/프리셋)** 조합으로 설계합니다.
- 유지보수, 확장, 재사용, 테스트가 매우 쉬운 구조입니다.
- 각 섹션별로 커스텀 클래스를 만들어, 상태/이벤트/헬퍼/시나리오를 한 곳에 모아 관리합니다.

## 2. 폴더/파일 구조
```
js/modules/SectionAnimationBase.js         # 추상클래스/공통 헬퍼
js/modules/AnimationEffectPresets.js       # 프리셋/빌더
js/animations/curation.js 등               # 섹션별 커스텀 클래스
```

## 3. SectionAnimationBase 추상클래스
- 반드시 `buildScenario()`를 구현해야 합니다.
- 필요시 `timelineOptions`, `scrollTrigger`, `effectMap`을 오버라이드할 수 있습니다.
- `init()`, `destroy()`, `refresh()` 등 라이프사이클 메서드 제공
- 공통 시나리오 step 헬퍼(set, to, addLabel, containerAnimation, scrollTriggerStep) 내장

### 예시 (js/modules/SectionAnimationBase.js)
```js
export class SectionAnimationBase {
  constructor(context = {}) { ... }
  buildScenario() { throw new Error('buildScenario() must be implemented by subclass'); }
  get timelineOptions() { return {}; }
  get scrollTrigger() { return undefined; }
  get effectMap() { return undefined; }
  init() { ... }
  destroy() { ... }
  refresh() { ... }
  createTimeline() { ... }
}
// 헬퍼 함수: set, to, addLabel, containerAnimation, scrollTriggerStep
```

## 4. 함수형 헬퍼/프리셋
- **시나리오 step 헬퍼**: set, to, addLabel, containerAnimation, scrollTriggerStep
- **EffectPresets**: fadeIn, fadeOut, slideInY 등 (AnimationEffectPresets.js)
- **커스텀 헬퍼**: fadeInCards, scrollCards 등(필요시 직접 추가)

### 예시 (js/modules/AnimationEffectPresets.js)
```js
export const EffectPresets = {
  fadeIn: (opts = {}) => ({ opacity: 1, y: 0, duration: opts.duration || 1, ...opts }),
  // ...
};
export function buildTimeline(scenario, timeline, effectMap = EffectPresets) { ... }
```

## 4-1. 고급 시나리오 헬퍼
- **each(arr, fn)**: 배열을 순회하며 step을 생성 (map과 동일, 플랫하게 합침)
- **group(steps, label?)**: 여러 step을 하나의 논리적 블록으로 그룹화 (가독성/구조화용)
- **ifStep(condition, stepsOrFn)**: 조건부로 step을 포함 (조건이 false면 빈 배열 반환)
- **fadeInCards(cards, opts?)**: 카드 fade-in 패턴을 위한 헬퍼 (여러 카드에 stagger 적용)

### 예시
```js
import { set, to, each, group, ifStep, fadeInCards } from '../modules/SectionAnimationBase.js';

// buildScenario 내부
return [
  ...each(cards, (card, i) => [ set(card, {...}), to(card, null, undefined, {...}) ]),
  ...group([
    set(a, {...}),
    to(a, null, undefined, {...})
  ], 'intro'),
  ...ifStep(isMobile, [ set(a, {...}) ]),
  ...fadeInCards(cards, { stagger: 0.1 })
];
```

## 4-2. ScenarioBuilder 클래스
- **ScenarioBuilder**: 체이닝 방식으로 시나리오를 선언할 수 있는 빌더 클래스
- 기존 배열 기반 시나리오와 100% 호환, 복잡한 시나리오에 유용
- 주요 메서드: add, set, to, addLabel, containerAnimation, scrollTriggerStep, group, ifStep, fadeInCards, build/toArray

### 예시
```js
import { ScenarioBuilder, set, to, fadeInCards } from '../modules/SectionAnimationBase.js';

// buildScenario 내부
const builder = new ScenarioBuilder();
builder
  .set(a, {...})
  .group([
    to(a, null, undefined, {...}),
    to(b, null, undefined, {...})
  ])
  .ifStep(isMobile, [ set(a, {...}) ])
  .fadeInCards(cards, { stagger: 0.1 });
return builder.build();
```

- **베스트 프랙티스**: 단순한 시나리오는 배열, 복잡하거나 동적 분기/반복이 많으면 ScenarioBuilder 사용

## 5. 실전 예시: 커스텀 섹션 클래스 만들기
### (js/animations/curation.js)
```js
import { SectionAnimationBase, set, to, addLabel, containerAnimation, scrollTriggerStep } from '../modules/SectionAnimationBase.js';
import { getResponsiveValue, EASING } from '../utils.js';

class CurationSection extends SectionAnimationBase {
  constructor() { ... }
  activateItem(index) { ... }
  buildScenario() {
    if (this.isMobile) {
      // 모바일 시나리오 step 배열 반환
    } else {
      // PC 시나리오 step 배열 반환
    }
  }
  get scrollTrigger() { ... }
}
export function initCurationAnimation() {
  const curation = new CurationSection();
  curation.init();
}
```

## 6. 확장/재사용 전략
- **공통 패턴은 함수형 헬퍼로 추상화**
  - 예: fadeInCards(cards, opts), scrollCards(cards, list, opts)
- **섹션별 커스텀 로직/상태/이벤트는 클래스에서 관리**
- **여러 섹션에서 동일/유사 애니메이션을 쉽게 재사용**
- **OOP(클래스) + 함수형(헬퍼/프리셋) 조합**이 가장 실용적

## 7. FAQ & 베스트 프랙티스
- **Q: 함수형만, OOP만 쓸 때의 한계?**
  - 함수형만: 상태/이벤트/라이프사이클 관리가 분산됨
  - OOP만: 조합성/재사용성이 떨어짐
  - → 둘을 조합하면 확장성과 유지보수성이 극대화됨
- **Q: 콜백/이벤트/상태관리 팁?**
  - scenario step의 onStart, onComplete, 커스텀 메서드 활용
- **Q: 테스트/디버깅/확장 가이드?**
  - 각 섹션은 독립적으로 테스트 가능, 헬퍼 함수는 단위테스트/재사용 가능

---

**이 구조를 표준으로 사용하면, 복잡한 GSAP/ScrollTrigger 기반 애니메이션도 일관성 있게, 쉽게, 확장성 있게 관리할 수 있습니다!** 