/**
 * GSAP에서 자주 쓰는 효과 프리셋 모음 (함수형)
 * 각 프리셋은 옵션을 받아 GSAP 애니메이션 파라미터 객체를 반환
 *
 * @example
 *   gsap.to('.el', EffectPresets.fadeIn({ duration: 1 }))
 */
export const EffectPresets = {
  /**
   * fadeIn: opacity 1, y 0, 기본 1초
   * @param {object} opts
   * @returns {object}
   */
  fadeIn: (opts = {}) => ({ opacity: 1, y: 0, duration: opts.duration || 1, ...opts }),
  /**
   * fadeOut: opacity 0, y 0, 기본 1초
   * @param {object} opts
   * @returns {object}
   */
  fadeOut: (opts = {}) => ({ opacity: 0, y: 0, duration: opts.duration || 1, ...opts }),
  /**
   * fadeInFrom: from-to 형태로 opacity 0→1
   * @param {object} opts
   * @returns {{from: object, to: object}}
   */
  fadeInFrom: (opts = {}) => ({ from: { opacity: 0, ...opts.from }, to: { opacity: 1, ...opts.to } }),
  /**
   * slideInY: y축 슬라이드 인, opacity 1
   * @param {object} opts
   * @returns {object}
   */
  slideInY: (opts = {}) => ({ opacity: 1, y: 0, duration: opts.duration || 1, ...opts }),
  /**
   * slideOutY: y축 슬라이드 아웃, opacity 0
   * @param {object} opts
   * @returns {object}
   */
  slideOutY: (opts = {}) => ({ opacity: 0, y: 50, duration: opts.duration || 1, ...opts }),
  /**
   * slideInX: x축 슬라이드 인, opacity 1
   * @param {object} opts
   * @returns {object}
   */
  slideInX: (opts = {}) => ({ opacity: 1, x: 0, duration: opts.duration || 1, ...opts }),
  /**
   * slideOutX: x축 슬라이드 아웃, opacity 0
   * @param {object} opts
   * @returns {object}
   */
  slideOutX: (opts = {}) => ({ opacity: 0, x: 50, duration: opts.duration || 1, ...opts }),
  /**
   * scaleIn: scale 1, opacity 1
   * @param {object} opts
   * @returns {object}
   */
  scaleIn: (opts = {}) => ({ opacity: 1, scale: 1, duration: opts.duration || 1, ...opts }),
  /**
   * scaleOut: scale 0.8, opacity 0
   * @param {object} opts
   * @returns {object}
   */
  scaleOut: (opts = {}) => ({ opacity: 0, scale: 0.8, duration: opts.duration || 1, ...opts }),
  // ...필요시 추가
};

/**
 * 선언적 애니메이션 시나리오(step 배열)을 GSAP timeline에 적용하는 빌더 함수
 *
 * @param {Array} scenario - [{ type, target, effect, at, options, from, to, label, props }]
 * @param {gsap.core.Timeline} timeline - gsap.timeline 인스턴스
 * @param {object} [effectMap=EffectPresets] - 커스텀 이펙트 맵(선택)
 * @returns {gsap.core.Timeline}
 *
 * @example
 *   buildTimeline([
 *     { type: 'to', target: '.el', effect: 'fadeIn', options: { duration: 1 } }
 *   ], gsap.timeline());
 */
export function buildTimeline(scenario, timeline, effectMap = EffectPresets) {
  // containerAnimation, scrollTrigger step 지원을 위한 context
  const context = {
    containerAnimations: {}, // key: name, value: gsap animation
  };
  scenario.forEach(step => {
    const { type = 'to', target, effect, at, options = {}, from, to, label, props, key, containerAnimation, ...rest } = step;
    const effectFn = effect && effectMap[effect];
    if (type === 'set') {
      timeline.set(target, props || (effectFn ? effectFn(options) : options), at);
    } else if (type === 'from') {
      timeline.from(target, props || (effectFn ? effectFn(options) : options), at);
    } else if (type === 'fromTo') {
      let fromOpts, toOpts;
      if (effectFn && effectFn(options).from && effectFn(options).to) {
        ({ from: fromOpts, to: toOpts } = effectFn(options));
      } else {
        fromOpts = from || {};
        toOpts = to || {};
      }
      timeline.fromTo(target, fromOpts, toOpts, at);
    } else if (type === 'addLabel') {
      timeline.addLabel(label, at);
    } else if (type === 'to') {
      timeline.to(target, props || (effectFn ? effectFn(options) : options), at);
    } else if (type === 'containerAnimation') {
      // gsap.to로 별도 애니메이션 생성, key로 context에 저장
      const anim = gsap.to(target, props);
      if (key) context.containerAnimations[key] = anim;
    } else if (type === 'scrollTrigger') {
      // containerAnimation이 key로 지정된 경우 참조
      let containerAnim = null;
      if (containerAnimation && context.containerAnimations[containerAnimation]) {
        containerAnim = context.containerAnimations[containerAnimation];
      }
      const stOptions = { ...rest };
      if (containerAnim) stOptions.containerAnimation = containerAnim;
      ScrollTrigger.create({
        trigger: target,
        ...stOptions
      });
    } else {
      throw new Error(`Unknown animation step type: ${type}`);
    }
  });
  return timeline;
} 