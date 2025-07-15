import { getResponsiveValue, EASING } from '../utils.js';
import { SectionAnimationBase, set, to, addLabel } from '../modules/SectionAnimationBase.js';

class IntroSection extends SectionAnimationBase {
  constructor() {
    super();
    this.$wrapper = document.querySelector('.intro_wrap');
    this.bg = '.intro_wrap .background';
    this.text = '.intro_wrap .intro_headline';
    this.emphasis = '.intro_wrap .font_orange';
  }
  buildScenario() {
    const { bg, text, emphasis } = this;
    return [
      set(text, { position: 'relative', zIndex: 1 }),
      set(bg, { zIndex: 0 }),
      addLabel('init'),
      set(bg, { opacity: 0, display: 'none' }),
      set(text, { opacity: 0, y: getResponsiveValue(30, 40), scale: 0.9 }),
      set(emphasis, { opacity: 0, y: 25, scale: 0, marginLeft: getResponsiveValue(0, '-120px'), marginRight: getResponsiveValue(0, '-120px'), display: 'none' }),
      addLabel('start'),
      to(bg, null, 0, { opacity: 1, display: 'inline-block', ...EASING }),
      to(text, null, 0, { opacity: 1, y: 0, scale: 1, ...EASING }),
      to(emphasis, null, '+=1', { opacity: 1, y: 0, scale: 1, marginLeft: '0', marginRight: '0', display: 'inline-block', duration: 0.5, ...EASING }),
      to({}, null, undefined, { duration: 2 })
    ];
  }
  get timelineOptions() {
    const { $wrapper, bg } = this;
    return {
      onStart: () => {
        $wrapper.classList.add('visible');
        document.querySelector(bg).classList.add('visible');
      }
    };
  }
  get scrollTrigger() {
    return {
      trigger: '.intro_wrap',
      pin: true,
      start: 'top top',
      end: '+=' + window.innerHeight * getResponsiveValue(3, 2),
      scrub: 1,
    };
  }
}

export function initIntroAnimation() {
  const intro = new IntroSection();
  if (intro.$wrapper) intro.init();
} 