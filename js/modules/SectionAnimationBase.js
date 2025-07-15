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