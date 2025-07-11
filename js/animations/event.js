import { getResponsiveValue, EASING } from '../utils.js';

/**
 * Event(이벤트) 섹션 애니메이션을 초기화하는 함수 (intro_new.js의 sectionEvent 1:1 이관)
 */
export function initEventAnimation() {
    const $wrapper = document.querySelector('.gate_event_wrap');
    if (!$wrapper) return;

    const wait = '.gate_headline .msg1';
    const question = '.gate_headline .msg2';
    const desc = '.gate_description';
    const button = '.btn_event_gate';

    gsap.set($wrapper, { opacity: 0, y: getResponsiveValue(15, 30), visibility: 'visible'});

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.gate_event_wrap',
            start: 'top 40%',
            end: '+=' + window.innerHeight * getResponsiveValue(0.2, 0.3),
            scrub: 1
        }
    });

    timeline.addLabel('setting')
    .set([wait, question, desc, button], { opacity: 0, y: getResponsiveValue(15, 30), scale: 0.98, visibility: 'hidden'})
    .to($wrapper, { opacity: 1, y: 0, duration: 0.2, ...EASING})
    .to(wait, { opacity: 1, y: 0, scale: 1, visibility: 'visible', ...EASING}, "-=0.2")
    .to(question, { opacity: 1, y: 0, scale: 1, visibility: 'visible', ...EASING}, "+=0.2")
    .to(desc, { opacity: 1, y: 0, scale: 1, visibility: 'visible', ...EASING}, "+=0.2")
    .to(button, { opacity: 1, y: 0, scale: 1, visibility: 'visible', ...EASING}, "+=0.2");
} 