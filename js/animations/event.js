import { getResponsiveValue, EASING } from '../utils.js';
import { SectionAnimationBase, ScenarioBuilder } from '../modules/SectionAnimationBase.js';

class EventSection extends SectionAnimationBase {
  constructor() {
    super();
    this.$wrapper = document.querySelector('.gate_event_wrap');
    this.wait = '.gate_headline .msg1';
    this.question = '.gate_headline .msg2';
    this.desc = '.gate_description';
    this.button = '.btn_event_gate';
  }
  buildScenario() {
    const { $wrapper, wait, question, desc, button } = this;
    return new ScenarioBuilder()
      .set($wrapper, { opacity: 0, y: getResponsiveValue(15, 30), visibility: 'visible' })
      .addLabel('setting')
      .set([wait, question, desc, button], { opacity: 0, y: getResponsiveValue(15, 30), scale: 0.98, visibility: 'hidden' })
      .to($wrapper, null, undefined, { opacity: 1, y: 0, duration: 0.2, ...EASING })
      .to(wait, null, '-=0.2', { opacity: 1, y: 0, scale: 1, visibility: 'visible', ...EASING })
      .to(question, null, '+=0.2', { opacity: 1, y: 0, scale: 1, visibility: 'visible', ...EASING })
      .to(desc, null, '+=0.2', { opacity: 1, y: 0, scale: 1, visibility: 'visible', ...EASING })
      .to(button, null, '+=0.2', { opacity: 1, y: 0, scale: 1, visibility: 'visible', ...EASING })
      .build();
  }
  get scrollTrigger() {
    return {
      trigger: '.gate_event_wrap',
      start: 'top 40%',
      end: '+=' + window.innerHeight * getResponsiveValue(0.2, 0.3),
      scrub: 1
    };
  }
}

export function initEventAnimation() {
  const event = new EventSection();
  if (event.$wrapper) event.init();
} 