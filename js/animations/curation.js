import { SectionAnimationBase, set, to, addLabel, containerAnimation, scrollTriggerStep } from '../modules/SectionAnimationBase.js';
import { getResponsiveValue, EASING } from '../utils.js';

class CurationSection extends SectionAnimationBase {
  constructor(context) {
    super(context);
    this.$wrapper = document.querySelector('.curation_wrap');
    this.$list = document.querySelector('.card_container');
    this.$cards = Array.from(document.querySelectorAll('.curation_wrap .card'));
    this.isMobile = getResponsiveValue(true, false);
    // 인덱스 표시
    this.$cards.forEach(($card, index) => {
      const indexElement = $card.querySelector('.card_series_index .font_white');
      if (indexElement) indexElement.textContent = (index + 1).toString();
    });
    // 초기화
    this.$cards.forEach(card => {
      card.classList.remove('active');
      gsap.set(card, {clearProps: 'opacity,y,scale,position,display'});
    });
  }
  activateItem(index) {
    this.$cards.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }
  buildScenario() {
    if (this.isMobile) {
      // --- Mobile scenario ---
      const CHANGE_DURATION = 0.3;
      const DELAY = 2.5;
      return this.$cards.flatMap(($card, index) => [
        addLabel('card' + (index + 1)),
        set($card, { position: 'absolute', opacity: index === 0 ? 1 : 0, y: 0 }),
        ...(index > 0 ? [to(this.$cards[index - 1], null, '<', { ...EASING, opacity: 0, duration: CHANGE_DURATION })] : []),
        to($card, null, undefined, {
          ...EASING,
          opacity: 1,
          duration: CHANGE_DURATION,
          onStart: () => this.activateItem(index),
          onReverseComplete: () => this.activateItem(index)
        }),
        to({}, null, undefined, { duration: DELAY })
      ]).concat([to({}, null, undefined, { duration: DELAY })]);
    } else {
      // --- PC scenario (containerAnimation/scrollTrigger step 활용) ---
      const CARD_WIDTH = this.$cards[0].clientWidth;
      const CARD_COUNT = this.$cards.length;
      const CARD_GAP = parseInt(window.getComputedStyle(this.$list).getPropertyValue('gap'));
      const SIDE_PADDING = parseInt(window.getComputedStyle(this.$list).getPropertyValue('padding-left'));
      const SCROLL_WIDTH = window.innerWidth * 4;
      const getStartPoint = (index) => SIDE_PADDING + CARD_GAP + Math.ceil((window.innerWidth - (SIDE_PADDING + CARD_GAP + CARD_WIDTH * 0.5)) / CARD_COUNT) * index;
      const scenario = [
        containerAnimation(this.$list, {
          xPercent: 0.03 * window.innerWidth - 90.2,
          ease: 'steps(600)',
          scrollTrigger: {
            trigger: this.$wrapper,
            start: 'top top',
            end: '+=' + SCROLL_WIDTH,
            pin: true,
            scrub: 1
          }
        }, 'listScroller')
      ];
      this.$cards.forEach((item, index) => {
        const startPoint = getStartPoint(index);
        const endPoint = getStartPoint(index + 1);
        scenario.push(scrollTriggerStep(item, {
          containerAnimation: 'listScroller',
          start: 'left+=' + Math.min(1, index) * 20 + ' ' + startPoint,
          end: 'right+=40 ' + endPoint,
          onEnter: () => this.activateItem(index),
          onEnterBack: () => this.activateItem(index)
        }));
      });
      return scenario;
    }
  }
  get scrollTrigger() {
    if (this.isMobile) {
      return {
        trigger: '.curation_wrap',
        pin: true,
        start: 'top top',
        end: '+=' + window.innerHeight * 2.5 * this.$cards.length,
        scrub: 1,
      };
    }
    return undefined;
  }
}

export function initCurationAnimation() {
  const curation = new CurationSection();
  curation.init();
} 