/**
 * Promise 섹션 애니메이션 모듈
 */

import { getResponsiveValue, EASING } from '../utils.js';

/**
 * Promise 섹션 애니메이션을 초기화하는 함수
 */
export const initPromiseAnimation = () => {
    const $wrapper = document.querySelector('.promise_wrap');
    if (!$wrapper) return;

    const keywords = ['.promise_words .word1', '.promise_words .word2', '.promise_words .word3'];
    const subject = '.promise_wrap .promise_headline_top';
    const predicate = '.promise_wrap .promise_headline_bottom';
    const bg = '.promise_wrap .background';

    const KEYWORD_HEIGHT = getResponsiveValue(34, 76);

    gsap.set([subject, predicate, bg], { opacity: 0, y: 20, scale: 1 });
    gsap.set(keywords, { opacity: 0, height: KEYWORD_HEIGHT, scale: 1, display: 'none' });

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.promise_wrap',
            pin: true,
            start: 'top top',
            end: '+=' + window.innerHeight * getResponsiveValue(6.5, 5),
            scrub: 1
        }
    });

    timeline
        .addLabel('setting')
        .set(keywords[0], { opacity: 1, display: 'inline-block' })
        .addLabel('appear')
        .to(subject, { opacity: 1, scale: 1, y: 1, ...EASING })
        .to([bg, predicate], { opacity: 1, scale: 1, y: 0, ...EASING }, "+=0.8")
        .addLabel('text_change')
        .to({}, { duration: 1 })
        .to(keywords[0], { opacity: 0, duration: 0.2, ...EASING }) //disappear
        .set(keywords[0], { display: 'none' })
        .set(keywords[1], { display: 'inline-block' })
        .to(keywords[1], { opacity: 1, duration: 1, ...EASING }, '<')
        .addLabel('text_change2')
        .to({}, { duration: 1 })
        .to(keywords[1], { opacity: 0, duration: 0.2, ...EASING }) //disappear
        .set(keywords[1], { display: 'none' })
        .set(keywords[2], { display: 'inline-block' })
        .to(keywords[2], { opacity: 1, duration: 1, ...EASING }, '<')
        .to({}, { duration: 1 })
        .addLabel('finish')
        .to(bg, { opacity: 0, duration: 1, ...EASING });
}; 