import { getResponsiveValue, EASING } from '../utils.js';
import { SectionAnimationBase, set, to, addLabel } from '../modules/SectionAnimationBase.js';

class PromiseSection extends SectionAnimationBase {
  constructor() {
    super();
    this.$wrapper = document.querySelector('.promise_wrap');
    this.keywords = ['.promise_words .word1', '.promise_words .word2', '.promise_words .word3'];
    this.subject = '.promise_wrap .promise_headline_top';
    this.predicate = '.promise_wrap .promise_headline_bottom';
    this.bg = '.promise_wrap .background';
    this.KEYWORD_HEIGHT = getResponsiveValue(34, 76);
  }
  buildScenario() {
    const { keywords, subject, predicate, bg, KEYWORD_HEIGHT } = this;
    return [
      set([subject, predicate, bg], { opacity: 0, y: 20, scale: 1 }),
      set(keywords, { opacity: 0, height: KEYWORD_HEIGHT, scale: 1, display: 'none' }),
      addLabel('setting'),
      set(keywords[0], { opacity: 1, display: 'inline-block' }),
      addLabel('appear'),
      to(subject, null, undefined, { opacity: 1, scale: 1, y: 1, ...EASING }),
      to([bg, predicate], null, '+=0.8', { opacity: 1, scale: 1, y: 0, ...EASING }),
      addLabel('text_change'),
      to({}, null, undefined, { duration: 1 }),
      to(keywords[0], null, undefined, { opacity: 0, duration: 0.2, ...EASING }),
      set(keywords[0], { display: 'none' }),
      set(keywords[1], { display: 'inline-block' }),
      to(keywords[1], null, '<', { opacity: 1, duration: 1, ...EASING }),
      addLabel('text_change2'),
      to({}, null, undefined, { duration: 1 }),
      to(keywords[1], null, undefined, { opacity: 0, duration: 0.2, ...EASING }),
      set(keywords[1], { display: 'none' }),
      set(keywords[2], { display: 'inline-block' }),
      to(keywords[2], null, '<', { opacity: 1, duration: 1, ...EASING }),
      to({}, null, undefined, { duration: 1 }),
      addLabel('finish'),
      to(bg, null, undefined, { opacity: 0, duration: 1, ...EASING })
    ];
  }
  get scrollTrigger() {
    return {
      trigger: '.promise_wrap',
      pin: true,
      start: 'top top',
      end: '+=' + window.innerHeight * getResponsiveValue(6.5, 5),
      scrub: 1
    };
  }
}

export function initPromiseAnimation() {
  const promise = new PromiseSection();
  if (promise.$wrapper) promise.init();
} 