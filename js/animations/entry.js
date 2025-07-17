/*
 * [실사용 예시] SectionAnimationBase 및 시나리오 헬퍼(set, to, addLabel 등) 활용 예시.
 * - 본 파일은 실제 섹션 애니메이션에서 시나리오 헬퍼를 어떻게 사용하는지 보여줍니다.
 * - 시나리오 선언은 배열 기반이며, 필요시 고급 헬퍼(each, group, ifStep, fadeInCards 등)와 ScenarioBuilder도 활용 가능.
 * - 전체 구조/확장/고급 사용법은 doc/GSAP-OOP-Functional-Pattern.md 참고.
 */
import { getResponsiveValue, EASING } from '../utils.js';
import { SectionAnimationBase, ScenarioBuilder } from '../modules/SectionAnimationBase.js';

class EntrySection extends SectionAnimationBase {
  constructor() {
    super();
    this.$wrapper = document.getElementById('entry-heading');
    if (!this.$wrapper) return;
    this.sentence = '.entry_headline';
    this.$firstWord = document.querySelector('.initial_text.text1');
    this.words = [
      '.entry_words .word1',
      '.entry_words .word2',
      '.entry_words .word3',
      '.entry_words .word4'
    ];
    this.$lastWord = document.querySelector('.initial_text.text2');
    this.motionDir = getResponsiveValue('y', 'x');
    this.otherDir = getResponsiveValue('x', 'y');
    this.wordResetPos = getResponsiveValue('-50%', 0);
    this.FIRST_WORD_INIT = getResponsiveValue(5 ,106);
    this.FIRST_WORD_START_MOBILE = -20;
    this.LAST_WORD_INIT = getResponsiveValue(20 ,0);
    this.APPEAR = getResponsiveValue(0, -53);
    this.DISAPPEAR = getResponsiveValue(-15, -43);
  }
  buildScenario() {
    const {
      $firstWord, $lastWord, words, motionDir, otherDir, wordResetPos,
      FIRST_WORD_INIT, FIRST_WORD_START_MOBILE, LAST_WORD_INIT, APPEAR, DISAPPEAR, sentence
    } = this;
    return new ScenarioBuilder()
      .addLabel('set')
      .set($firstWord, { [motionDir]: FIRST_WORD_INIT, [otherDir]: 0, opacity: 1 })
      .set($lastWord, { [motionDir]: LAST_WORD_INIT, [otherDir]: 0, opacity: 1 })
      .set(words, { clearProps: 'x,y' })
      .addLabel('start')
      .add({ type: 'from', target: words[0], props: { [motionDir]: -25, [otherDir]: wordResetPos, opacity: 0, ...EASING } })
      .add({ type: 'from', target: words[1], props: { [motionDir]: -25, [otherDir]: wordResetPos, opacity: 0, ...EASING } })
      .add({ type: 'from', target: words[2], props: { [motionDir]: -25, [otherDir]: wordResetPos, opacity: 0, ...EASING } })
      .add({ type: 'from', target: words[3], props: { [motionDir]: -25, [otherDir]: wordResetPos, opacity: 0, ...EASING } })
      .addLabel('word_change_start')
      .to($firstWord, null, undefined, { [motionDir]: getResponsiveValue(FIRST_WORD_START_MOBILE, -93), [otherDir]: 0, duration: 1, ...EASING })
      .to($lastWord, null, '<', { [motionDir]: getResponsiveValue(65, 0), [otherDir]: 0, duration: 1, ...EASING })
      .to(words[0], null, '<', { [motionDir]: getResponsiveValue(0, -93), opacity: 1, duration: 1, ...EASING })
      .addLabel('word_change1')
      .to($firstWord, null, '+=2', { [motionDir]: getResponsiveValue(FIRST_WORD_START_MOBILE, -53), [otherDir]: 0, duration: 1, ...EASING })
      .to(words[0], null, '<', { [motionDir]: DISAPPEAR, opacity: 0, ...EASING })
      .to(words[1], null, '<', { [motionDir]: APPEAR, opacity: 1, duration: 1, ...EASING })
      .addLabel('word_change2')
      .to(words[1], null, '+=2', { [motionDir]: DISAPPEAR, opacity: 0, ...EASING })
      .to(words[2], null, '<', { [motionDir]: APPEAR, opacity: 1, duration: 1, ...EASING })
      .addLabel('word_change3')
      .to(words[2], null, '+=2', { [motionDir]: DISAPPEAR, opacity: 0, ...EASING })
      .to(words[3], null, '<', { [motionDir]: APPEAR, opacity: 1, duration: 1, ...EASING })
      .addLabel('disappear')
      .to(sentence, null, '+=3', { zoom: 5, opacity: 0, duration: 1, ...EASING })
      .addLabel('end')
      .build();
  }
  get scrollTrigger() {
    return {
      trigger: '.entry_wrap',
      pin: true,
      start: 'top top',
      end: '+=' + window.innerHeight * 6,
      scrub: 1,
    };
  }
}

export function initEntryAnimation() {
  const entry = new EntrySection();
  if (entry.$wrapper) entry.init();
} 