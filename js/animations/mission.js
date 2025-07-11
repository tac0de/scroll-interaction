import { getResponsiveValue, EASING } from '../utils.js';

/**
 * Mission 섹션 애니메이션을 초기화하는 함수 (intro_new.js의 sectionMission 1:1 이관)
 */
export function initMissionAnimation() {
    const $wrapper = document.querySelector('.mission_wrap');
    if (!$wrapper) return;

    const $chapters = Array.from(document.querySelectorAll('.mission_wrap_item'));
    const $items = $chapters.map((chapter) => chapter.querySelectorAll('.mission_list li'));

    $chapters.forEach(($chapter, index) => {
        $chapter.classList.remove('active');
    });

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.mission_wrap_container',
            pin: true,
            start: 'top 60px',
            end: '+=' + window.innerHeight * getResponsiveValue(20, 10),
            scrub: 1,
        }
    });

    const CHANGE_DURATION = 0.3;
    const STABLE_DURATION = 1.8;

    timeline.set('.mission_wrap_item', { opacity: 0 })
    .set('.mission_list li', { opacity: 0.15 })
    .addLabel('mission')
    .to($chapters[0], {
        opacity: 1,
        duration: 0.1,
        ...EASING,
        onStart: () => $chapters[0].classList.add('active')
    })
    .to($items[0][0], {opacity: 1, ...EASING}, '<')
    .to({}, {duration: STABLE_DURATION})
    .to($items[0][0], {opacity: 0.15, duration: CHANGE_DURATION, ...EASING}) //change
    .to($items[0][1], {opacity: 1, duration: CHANGE_DURATION, ...EASING}, '<')
    .to({}, {duration: STABLE_DURATION * 1.5})
    .to($chapters[0], {
        opacity: 0,
        duration: 0.1,
        onComplete: () => $chapters[0].classList.remove('active'),
        onReverseComplete: () => $chapters[0].classList.add('active')
    })
    .addLabel('benefit')
    .to($chapters[1], {
        opacity: 1,
        duration: 0.1,
        ...EASING,
        onStart: () => $chapters[1].classList.add('active')
    }, '+=0.2')
    .to($items[1][0], {opacity: 1, duration: CHANGE_DURATION, ...EASING}, '<')
    .to({}, {duration: STABLE_DURATION})
    .to($items[1][0], {opacity: 0.15, duration: CHANGE_DURATION, ...EASING}) //change
    .to($items[1][1], {opacity: 1, duration: CHANGE_DURATION, ...EASING}, '<')
    .to({}, {duration: STABLE_DURATION * 1.5})
    .to($chapters[1], {
        opacity: 0,
        duration: 0.1,
        onComplete: () => $chapters[1].classList.remove('active'),
        onReverseComplete: () => $chapters[1].classList.add('active')
    })
    .addLabel('Personality')
    .to($chapters[2], {
        opacity: 1,
        duration: 0.1,
        ...EASING,
        onStart: () => $chapters[2].classList.add('active')
    }, '+=0.2')
    .to($items[2][0], {opacity: 1, duration: CHANGE_DURATION, ...EASING}, '<')
    .to({}, {duration: STABLE_DURATION})
    .to($items[2][1], {opacity: 1, duration: CHANGE_DURATION, ...EASING})
    .to({}, {duration: STABLE_DURATION})
    .to($items[2][2], {opacity: 1, duration: CHANGE_DURATION, ...EASING})
    .to({}, {duration: STABLE_DURATION * 1.8});
} 