/**
 * Entry 섹션 애니메이션 모듈
 */

import { getResponsiveValue, EASING } from '../utils.js';

/**
 * Entry 섹션 애니메이션을 초기화하는 함수
 */
export const initEntryAnimation = () => {
    const $wrapper = document.getElementById('entry-heading');
    if (!$wrapper) return;

    const sentence = '.entry_headline';
    const $firstWord = document.querySelector('.initial_text.text1');
    const words = ['.entry_words .word1', '.entry_words .word2', '.entry_words .word3', '.entry_words .word4'];
    const $lastWord = document.querySelector('.initial_text.text2');

    const motionDir = getResponsiveValue('y', 'x');
    const otherDir = getResponsiveValue('x', 'y');
    const wordResetPos = getResponsiveValue('-50%', 0);

    const FIRST_WORD_INIT = getResponsiveValue(5, 106);
    const FIRST_WORD_START_MOBILE = -20;
    const LAST_WORD_INIT = getResponsiveValue(20, 0);
    const APPEAR = getResponsiveValue(0, -53);
    const DISAPPEAR = getResponsiveValue(-15, -43);

    // 초기화 (등장)
    gsap.fromTo($firstWord, { [motionDir]: 0, opacity: 0 }, { [motionDir]: FIRST_WORD_INIT, [otherDir]: 0, opacity: 1, duration: 0.8 }, 0);
    gsap.fromTo($lastWord, { [motionDir]: 0, opacity: 0 }, { [motionDir]: LAST_WORD_INIT, [otherDir]: 0, opacity: 1, duration: 0.8 }, '<');

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.entry_wrap',
            pin: true,
            start: 'top top',
            end: '+=' + window.innerHeight * 6,
            scrub: 1,
        }
    });

    timeline
        .addLabel('set')
        .set($firstWord, { [motionDir]: FIRST_WORD_INIT, [otherDir]: 0, opacity: 1 })
        .set($lastWord, { [motionDir]: LAST_WORD_INIT, [otherDir]: 0, opacity: 1 })
        .set(words, { clearProps: 'x,y' })
        .addLabel('start')
        .from(words[0], { [motionDir]: -25, [otherDir]: wordResetPos, opacity: 0, ...EASING })
        .from(words[1], { [motionDir]: -25, [otherDir]: wordResetPos, opacity: 0, ...EASING })
        .from(words[2], { [motionDir]: -25, [otherDir]: wordResetPos, opacity: 0, ...EASING })
        .from(words[3], { [motionDir]: -25, [otherDir]: wordResetPos, opacity: 0, ...EASING })
        .addLabel('word_change_start')
        .to($firstWord, { [motionDir]: getResponsiveValue(FIRST_WORD_START_MOBILE, -93), [otherDir]: 0, duration: 1, ...EASING })
        .to($lastWord, { [motionDir]: getResponsiveValue(65, 0), [otherDir]: 0, duration: 1, ...EASING }, '<')
        .to(words[0], { [motionDir]: getResponsiveValue(0, -93), opacity: 1, duration: 1, ...EASING }, '<') // appear
        .addLabel('word_change1')
        .to($firstWord, { [motionDir]: getResponsiveValue(FIRST_WORD_START_MOBILE, -53), [otherDir]: 0, duration: 1, ...EASING }, '+=2') // PC에서 '당신의' 글자이동
        .to(words[0], { [motionDir]: DISAPPEAR, opacity: 0, ...EASING }, '<')
        .to(words[1], { [motionDir]: APPEAR, opacity: 1, duration: 1, ...EASING }, '<') // appear
        .addLabel('word_change2')
        .to(words[1], { [motionDir]: DISAPPEAR, opacity: 0, ...EASING }, '+=2')
        .to(words[2], { [motionDir]: APPEAR, opacity: 1, duration: 1, ...EASING }, '<') // appear
        .addLabel('word_change3')
        .to(words[2], { [motionDir]: DISAPPEAR, opacity: 0, ...EASING }, '+=2')
        .to(words[3], { [motionDir]: APPEAR, opacity: 1, duration: 1, ...EASING }, '<') // appear
        .addLabel('disappear')
        .to(sentence, { zoom: 5, opacity: 0, duration: 1, ...EASING }, '+=3')
        .addLabel('end');
}; 