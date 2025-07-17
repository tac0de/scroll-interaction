// SectionAnimationBase.js
// 선언적 시나리오 기반 섹션 애니메이션 추상 베이스 클래스 (헬퍼 기반 구조)
import { buildTimeline } from './AnimationEffectPresets.js';

export class SectionAnimationBase {
  /**
   * @param {object} context - 섹션별 DOM/데이터/옵션 등 자유롭게 전달
   */
  constructor(context = {}) {
    this.context = context;
    this.timeline = null;
    this._scrollTrigger = null; // 내부 인스턴스용
  }
  /**
   * 반드시 하위 클래스에서 시나리오를 반환하도록 구현
   * @returns {Array} scenario steps
   */
  buildScenario() {
    throw new Error('buildScenario() must be implemented by subclass');
  }
  /**
   * timelineOptions getter (필요시 오버라이드)
   */
  get timelineOptions() {
    return {};
  }
  /**
   * scrollTrigger getter (필요시 오버라이드, 옵션 반환용)
   */
  get scrollTrigger() {
    return undefined;
  }
  /**
   * effectMap getter (필요시 오버라이드)
   */
  get effectMap() {
    return undefined;
  }
  /**
   * 초기화 (destroy 후 재생성)
   */
  init() {
    this.destroy();
    this.createTimeline();
  }
  /**
   * 타임라인/트리거 제거
   */
  destroy() {
    if (this.timeline) this.timeline.kill();
    if (this._scrollTrigger) this._scrollTrigger.kill();
  }
  /**
   * 리프레시 (옵션/상태 변경 시 재생성)
   */
  refresh() {
    this.init();
  }
  /**
   * 타임라인/트리거 생성 (scenario, timelineOptions, scrollTrigger, effectMap)
   */
  createTimeline() {
    const scenario = this.buildScenario();
    const timelineOptions = this.timelineOptions || {};
    const scrollTrigger = this.scrollTrigger;
    const effectMap = this.effectMap;
    this.timeline = gsap.timeline({
      ...timelineOptions,
      scrollTrigger: scrollTrigger
    });
    buildTimeline(scenario, this.timeline, effectMap);
    this._scrollTrigger = this.timeline.scrollTrigger;
  }
}

// 시나리오 step 헬퍼 함수 예시 (공통 import 용)
export const set = (target, props, at) => ({ type: 'set', target, props, at });
export const to = (target, effect, at, options = {}) => ({ type: 'to', target, effect, at, options });
export const addLabel = (label, at) => ({ type: 'addLabel', label, at });
export const containerAnimation = (target, props, key) => ({ type: 'containerAnimation', target, props, key });
export const scrollTriggerStep = (target, options) => ({ type: 'scrollTrigger', target, ...options }); 

/**
 * 고급 시나리오 헬퍼 함수들 (each, group, ifStep, fadeInCards 등)
 * 모든 헬퍼는 순수 함수이며, 기존 step 구조와 100% 호환됨
 */

/**
 * 배열을 순회하며 step을 생성 (map과 동일, 플랫하게 합침)
 * @template T
 * @param {T[]} arr - 순회할 배열
 * @param {(item: T, i: number, arr: T[]) => any[]} fn - step 생성 함수 (step 배열 반환)
 * @returns {any[]} - 플랫한 step 배열
 * @example
 *   each(cards, (card, i) => [ set(card, {...}), to(card, null, undefined, {...}) ])
 */
export function each(arr, fn) {
  return arr.flatMap(fn);
}

/**
 * 여러 step을 하나의 논리적 블록으로 그룹화 (실제 실행에는 영향 없음, 가독성/구조화용)
 * @param {any[]} steps - step 배열
 * @param {string} [label] - 그룹 라벨(선택)
 * @returns {any[]} - steps 그대로 반환 (추후 ScenarioBuilder 등에서 활용 가능)
 * @example
 *   group([
 *     set(a, {...}),
 *     to(a, null, undefined, {...})
 *   ], 'intro')
 */
export function group(steps, label) {
  // label은 현재는 주석/구조화용, step에 주입하지 않음
  return steps;
}

/**
 * 조건부로 step을 포함 (조건이 false면 빈 배열 반환)
 * @param {boolean} condition - 포함 여부
 * @param {any[]|function(): any[]} stepsOrFn - step 배열 또는 step 생성 함수
 * @returns {any[]} - condition이 true면 steps, 아니면 []
 * @example
 *   ...ifStep(isMobile, [ set(a, {...}) ])
 */
export function ifStep(condition, stepsOrFn) {
  if (!condition) return [];
  return typeof stepsOrFn === 'function' ? stepsOrFn() : stepsOrFn;
}

/**
 * 카드 fade-in 패턴을 위한 헬퍼 (여러 카드에 stagger 적용)
 * @param {Element[]|string[]} cards - 카드 배열 또는 셀렉터 배열
 * @param {object} [opts] - 옵션 (stagger, duration 등)
 * @returns {any[]} - step 배열
 * @example
 *   ...fadeInCards(cards, { stagger: 0.1 })
 */
export function fadeInCards(cards, opts = {}) {
  return cards.map((card, i) => to(card, 'fadeIn', i === 0 ? undefined : '<', { ...opts, stagger: 0, delay: opts.delay || 0 }));
}

/**
 * ScenarioBuilder: 체이닝 방식으로 시나리오를 선언할 수 있는 빌더 클래스
 * 기존 배열 기반 시나리오와 100% 호환, 복잡한 시나리오에 유용
 * @example
 *   const builder = new ScenarioBuilder();
 *   builder
 *     .add(set(a, {...}))
 *     .group([
 *       to(a, null, undefined, {...}),
 *       to(b, null, undefined, {...})
 *     ])
 *     .ifStep(isMobile, [ set(a, {...}) ])
 *     .add(...fadeInCards(cards, { stagger: 0.1 }));
 *   const scenario = builder.build();
 */
export class ScenarioBuilder {
  constructor() {
    this.steps = [];
  }
  /**
   * step 또는 step 배열 추가
   * @param {...any} steps
   * @returns {ScenarioBuilder}
   */
  add(...steps) {
    steps.forEach(step => {
      if (Array.isArray(step)) this.steps.push(...step);
      else if (step) this.steps.push(step);
    });
    return this;
  }
  /**
   * set step 추가
   * @param  {...any} args
   * @returns {ScenarioBuilder}
   */
  set(...args) {
    return this.add(set(...args));
  }
  /**
   * to step 추가
   * @param  {...any} args
   * @returns {ScenarioBuilder}
   */
  to(...args) {
    return this.add(to(...args));
  }
  /**
   * addLabel step 추가
   * @param  {...any} args
   * @returns {ScenarioBuilder}
   */
  addLabel(...args) {
    return this.add(addLabel(...args));
  }
  /**
   * containerAnimation step 추가
   * @param  {...any} args
   * @returns {ScenarioBuilder}
   */
  containerAnimation(...args) {
    return this.add(containerAnimation(...args));
  }
  /**
   * scrollTriggerStep 추가
   * @param  {...any} args
   * @returns {ScenarioBuilder}
   */
  scrollTriggerStep(...args) {
    return this.add(scrollTriggerStep(...args));
  }
  /**
   * group step 추가 (실제 steps만 추가)
   * @param {any[]} steps
   * @param {string} [label]
   * @returns {ScenarioBuilder}
   */
  group(steps, label) {
    return this.add(...group(steps, label));
  }
  /**
   * 조건부 step 추가
   * @param {boolean} condition
   * @param {any[]|function(): any[]} stepsOrFn
   * @returns {ScenarioBuilder}
   */
  ifStep(condition, stepsOrFn) {
    return this.add(...ifStep(condition, stepsOrFn));
  }
  /**
   * 카드 fade-in step 추가
   * @param {Element[]|string[]} cards
   * @param {object} [opts]
   * @returns {ScenarioBuilder}
   */
  fadeInCards(cards, opts) {
    return this.add(...fadeInCards(cards, opts));
  }
  /**
   * 최종 시나리오 배열 반환
   * @returns {any[]}
   */
  build() {
    return this.steps;
  }
  /**
   * toArray alias
   * @returns {any[]}
   */
  toArray() {
    return this.build();
  }
} 