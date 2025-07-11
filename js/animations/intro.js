import { getResponsiveValue, EASING } from '../utils.js';

/**
 * Intro 섹션 애니메이션을 초기화하는 함수 (intro_new.js의 sectionIntro 1:1 이관)
 */
export function initIntroAnimation() {
    const $wrapper = document.querySelector('.intro_wrap');
    if (!$wrapper) return;

    const bg = '.intro_wrap .background';
    const text = '.intro_wrap .intro_headline';
    const emphasis = '.intro_wrap .font_orange';

    gsap.set(text, { position: 'relative', zIndex: 1 });
    gsap.set(bg, { zIndex: 0 });

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.intro_wrap',
            pin: true,
            start: 'top top',
            end: '+=' + window.innerHeight * getResponsiveValue(3, 2),
            scrub: 1,
            onEnter: () => {
                $wrapper.classList.add('visible');
                document.querySelector(bg).classList.add('visible');
            }
        }
    });

    timeline.addLabel('init')
    .set(bg, {opacity: 0, display: 'none'})
    .set(text, {opacity: 0, y: getResponsiveValue(30, 40), scale: 0.9})
    .set(emphasis, {opacity: 0, y: 25, scale: 0, marginLeft: getResponsiveValue(0, '-120px'), marginRight: getResponsiveValue(0, '-120px'), display: 'none'})
    .addLabel('start')
    .to(bg, {opacity: 1, display: 'inline-block', ...EASING}, 0)
    .to(text, {opacity: 1, y: 0, scale: 1, ...EASING}, 0)
    .to(emphasis, {opacity: 1, y: 0, scale: 1, marginLeft: '0', marginRight: '0', display: 'inline-block', duration: 0.5, ...EASING }, '+=1')
    .to({}, {duration: 2});
} 