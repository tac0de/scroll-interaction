/**
 * Slogan 섹션 애니메이션 모듈
 */

import { getResponsiveValue, EASING } from '../utils.js';

/**
 * Slogan 섹션 애니메이션을 초기화하는 함수
 */
export const initSloganAnimation = () => {
    const $wrapper = document.querySelector('.slogan_wrap');
    if (!$wrapper) return;

    const bg = $wrapper.querySelector('.slogan_wrap .background');
    const texts = Array.from($wrapper.querySelectorAll('.slogan_headline > div'));

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.slogan_wrap',
            pin: true,
            start: 'top top',
            end: '+=' + window.innerHeight * getResponsiveValue(5, 3),
            scrub: 1,
        }
    });

    const BG_OFFSET_UNIT = getResponsiveValue(100, 65) / (texts.length - 1) * -1;

    timeline
        .addLabel('init')
        .set($wrapper, { backgroundColor: '#000' })
        .set(texts.slice(1), { opacity: 0, y: getResponsiveValue(15, 22), scale: 0.95 })
        .set(bg, { y: '0%', opacity: 1 }, 0)
        .set(texts[0], { opacity: 1, y: 0, scale: 1 }, 0)
        .addLabel('change_first')
        .to(bg, { y: BG_OFFSET_UNIT + '%', ...EASING }, "+=3")
        .to(texts[0], { opacity: 0, y: -getResponsiveValue(18, 22), scale: 0.95, duration: 1, ...EASING }, '-=0.4') //disappear
        .to(texts[1], { opacity: 1, y: 0, scale: 1, ...EASING }, '>') //appear
        .addLabel('change_second')
        .to(bg, { y: BG_OFFSET_UNIT * 2 + '%', ...EASING }, "+=3.5")
        .to(texts[1], { opacity: 0, y: -getResponsiveValue(18, 22), scale: 0.95, duration: 1, ...EASING }, '-=0.4') //disappear
        .to(texts[2], { opacity: 1, y: 0, scale: 1, ...EASING }, '>') //appear
        .to({}, { duration: 3 })
        .addLabel('fadeout_slogan')
        .to(texts[2], { opacity: 0, y: -getResponsiveValue(18, 22), scale: 0.95, duration: 0.75, ...EASING })
        .to($wrapper, { backgroundColor: '#fff', duration: 0.2, ...EASING }, "+=0.2");
}; 