import { getResponsiveValue, EASING } from '../utils.js';
import { SectionAnimationBase, set, to, addLabel } from '../modules/SectionAnimationBase.js';

class MissionSection extends SectionAnimationBase {
  constructor() {
    super();
    this.$wrapper = document.querySelector('.mission_wrap');
    this.$chapters = Array.from(document.querySelectorAll('.mission_wrap_item'));
    this.$items = this.$chapters.map((chapter) => chapter.querySelectorAll('.mission_list li'));
    this.$chapters.forEach(($chapter) => $chapter.classList.remove('active'));
    this.CHANGE_DURATION = 0.3;
    this.STABLE_DURATION = 1.8;
  }
  buildScenario() {
    const { $chapters, $items, CHANGE_DURATION, STABLE_DURATION } = this;
    return [
      set('.mission_wrap_item', { opacity: 0 }),
      set('.mission_list li', { opacity: 0.15 }),
      addLabel('mission'),
      to($chapters[0], null, undefined, { opacity: 1, duration: 0.1, ...EASING, onStart: () => $chapters[0].classList.add('active') }),
      to($items[0][0], null, '<', { opacity: 1, ...EASING }),
      to({}, null, undefined, { duration: STABLE_DURATION }),
      to($items[0][0], null, undefined, { opacity: 0.15, duration: CHANGE_DURATION, ...EASING }),
      to($items[0][1], null, '<', { opacity: 1, duration: CHANGE_DURATION, ...EASING }),
      to({}, null, undefined, { duration: STABLE_DURATION * 1.5 }),
      to($chapters[0], null, undefined, { opacity: 0, duration: 0.1, onComplete: () => $chapters[0].classList.remove('active'), onReverseComplete: () => $chapters[0].classList.add('active') }),
      addLabel('benefit'),
      to($chapters[1], null, '+=0.2', { opacity: 1, duration: 0.1, ...EASING, onStart: () => $chapters[1].classList.add('active') }),
      to($items[1][0], null, '<', { opacity: 1, duration: CHANGE_DURATION, ...EASING }),
      to({}, null, undefined, { duration: STABLE_DURATION }),
      to($items[1][0], null, undefined, { opacity: 0.15, duration: CHANGE_DURATION, ...EASING }),
      to($items[1][1], null, '<', { opacity: 1, duration: CHANGE_DURATION, ...EASING }),
      to({}, null, undefined, { duration: STABLE_DURATION * 1.5 }),
      to($chapters[1], null, undefined, { opacity: 0, duration: 0.1, onComplete: () => $chapters[1].classList.remove('active'), onReverseComplete: () => $chapters[1].classList.add('active') }),
      addLabel('Personality'),
      to($chapters[2], null, '+=0.2', { opacity: 1, duration: 0.1, ...EASING, onStart: () => $chapters[2].classList.add('active') }),
      to($items[2][0], null, '<', { opacity: 1, duration: CHANGE_DURATION, ...EASING }),
      to({}, null, undefined, { duration: STABLE_DURATION }),
      to($items[2][1], null, undefined, { opacity: 1, duration: CHANGE_DURATION, ...EASING }),
      to({}, null, undefined, { duration: STABLE_DURATION }),
      to($items[2][2], null, undefined, { opacity: 1, duration: CHANGE_DURATION, ...EASING }),
      to({}, null, undefined, { duration: STABLE_DURATION * 1.8 })
    ];
  }
  get scrollTrigger() {
    return {
      trigger: '.mission_wrap_container',
      pin: true,
      start: 'top 60px',
      end: '+=' + window.innerHeight * getResponsiveValue(20, 10),
      scrub: 1,
    };
  }
}

export function initMissionAnimation() {
  const mission = new MissionSection();
  if (mission.$wrapper) mission.init();
} 