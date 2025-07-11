import { getResponsiveValue, EASING } from '../utils.js';

/**
 * Film(브랜드 필름) 섹션 애니메이션을 초기화하는 함수 (intro_new.js의 sectionFilm 1:1 이관)
 */
export function initFilmAnimation() {
    const $wrapper = document.querySelector('.video_wrap');
    if (!$wrapper) return;

    const bg = '.video_wrap .video_background';
    const container = '.video_wrap .video_container';
    const title = '.video_wrap .video_headline';
    const line = '.video_wrap .video_separator_line';
    const $btn = document.querySelector('.video_wrap .btn_video');

    const WIDTH = getResponsiveValue('320px', '1200px');
    const HEIGHT = getResponsiveValue('186px', '675px');

    gsap.set([title, $btn], { opacity: 0, y: 20, scale: 0.95 });
    gsap.set(line, { width: 0, height: '1px', opacity: 0.3 });
    gsap.set(container, { opacity: 0, scale: 0.9, y: 30 });
    gsap.set(bg, {
        width: getResponsiveValue(WIDTH, '110vw'),
        height: getResponsiveValue(HEIGHT, '110vh'),
        borderRadius: '5px',
        opacity: getResponsiveValue(0.7, 1),
        scale: getResponsiveValue(0.95, 1.1)
    });

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.video_wrap',
            pin: true,
            start: 'top top',
            end: '+=' + window.innerHeight * getResponsiveValue(6, 3.5),
            scrub: 1,
        }
    });

    timeline.addLabel('start')
    .to($wrapper, {autoAlpha: 1, scale: 1, y: 0, ...EASING})
    .to(bg, {width: getResponsiveValue('110vw', WIDTH), height: getResponsiveValue('110vh', HEIGHT), borderRadius: '20px', opacity: 1, scale: 1, ...EASING})
    .to(container, {opacity: 1, scale: 1, y: 0, ...EASING})
    .to([title, $btn], {opacity: 1, y: 0, scale: 1, stagger: 0, duration: 0.8, ...EASING})
    .to(line, {width: '100%', duration: 0.4, ...EASING}, '-=0.4')
    .to({}, {duration: 0, onComplete: () => $btn.classList.add('active'), onReverseComplete: () => $btn.classList.remove('active')})
    .to({}, {duration: 2});
} 