import { getResponsiveValue, EASING } from '../utils.js';
import { SectionAnimationBase, ScenarioBuilder } from '../modules/SectionAnimationBase.js';

class SloganSection extends SectionAnimationBase {
  constructor() {
    super();
    this.$wrapper = document.querySelector('.slogan_wrap');
    this.bg = this.$wrapper.querySelector('.slogan_wrap .background');
    this.texts = Array.from(this.$wrapper.querySelectorAll('.slogan_headline > div'));
    this.BG_OFFSET_UNIT = getResponsiveValue(100, 65) / (this.texts.length - 1) * -1;
  }
  buildScenario() {
    const { $wrapper, bg, texts, BG_OFFSET_UNIT } = this;
    return new ScenarioBuilder()
      .addLabel('init')
      .set($wrapper, { backgroundColor: '#000' })
      .set(texts.slice(1), { opacity: 0, y: getResponsiveValue(15, 22), scale: 0.95 })
      .set(bg, { y: '0%', opacity: 1 })
      .set(texts[0], { opacity: 1, y: 0, scale: 1 })
      .addLabel('change_first')
      .to(bg, null, '+=3', { y: BG_OFFSET_UNIT + '%', ...EASING })
      .to(texts[0], null, '-=0.4', { opacity: 0, y: -getResponsiveValue(18, 22), scale: 0.95, duration: 1, ...EASING })
      .to(texts[1], null, '>', { opacity: 1, y: 0, scale: 1, ...EASING })
      .addLabel('change_second')
      .to(bg, null, '+=3.5', { y: BG_OFFSET_UNIT * 2 + '%', ...EASING })
      .to(texts[1], null, '-=0.4', { opacity: 0, y: -getResponsiveValue(18, 22), scale: 0.95, duration: 1, ...EASING })
      .to(texts[2], null, '>', { opacity: 1, y: 0, scale: 1, ...EASING })
      .to({}, null, undefined, { duration: 3 })
      .addLabel('fadeout_slogan')
      .to(texts[2], null, undefined, { opacity: 0, y: -getResponsiveValue(18, 22), scale: 0.95, duration: 0.75, ...EASING })
      .to($wrapper, null, '+=0.2', { backgroundColor: '#fff', duration: 0.2, ...EASING })
      .build();
  }
  get scrollTrigger() {
    return {
      trigger: '.slogan_wrap',
      pin: true,
      start: 'top top',
      end: '+=' + window.innerHeight * getResponsiveValue(5, 3),
      scrub: 1,
    };
  }
}

export function initSloganAnimation() {
  const slogan = new SloganSection();
  if (slogan.$wrapper) slogan.init();
} 