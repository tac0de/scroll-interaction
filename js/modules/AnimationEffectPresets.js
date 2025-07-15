// AnimationEffectPresets.js
// 공통 이펙트 프리셋과 선언적 애니메이션 빌더 함수

export const EffectPresets = {
  fadeIn: (opts = {}) => ({ opacity: 1, y: 0, duration: opts.duration || 1, ...opts }),
  fadeOut: (opts = {}) => ({ opacity: 0, y: 0, duration: opts.duration || 1, ...opts }),
  fadeInFrom: (opts = {}) => ({ from: { opacity: 0, ...opts.from }, to: { opacity: 1, ...opts.to } }),
  slideInY: (opts = {}) => ({ opacity: 1, y: 0, duration: opts.duration || 1, ...opts }),
  slideOutY: (opts = {}) => ({ opacity: 0, y: 50, duration: opts.duration || 1, ...opts }),
  slideInX: (opts = {}) => ({ opacity: 1, x: 0, duration: opts.duration || 1, ...opts }),
  slideOutX: (opts = {}) => ({ opacity: 0, x: 50, duration: opts.duration || 1, ...opts }),
  scaleIn: (opts = {}) => ({ opacity: 1, scale: 1, duration: opts.duration || 1, ...opts }),
  scaleOut: (opts = {}) => ({ opacity: 0, scale: 0.8, duration: opts.duration || 1, ...opts }),
  // ...필요시 추가
};

/**
 * 선언적 애니메이션 시나리오를 GSAP timeline에 적용하는 빌더 함수
 * @param {Array} scenario - [{ type, target, effect, at, options, from, to, label, props }]
 * @param {gsap.core.Timeline} timeline - gsap.timeline 인스턴스
 * @param {object} effectMap - (선택) 커스텀 이펙트 맵
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