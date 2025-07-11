import { getResponsiveValue, EASING } from '../utils.js';

/**
 * Curation 섹션 애니메이션을 초기화하는 함수 (intro_new.js의 sectionCuration 1:1 이관)
 */
export function initCurationAnimation() {
    const $wrapper = document.querySelector('.curation_wrap');
    if (!$wrapper) return;

    const $list = document.querySelector('.card_container');
    const $cards = document.querySelectorAll('.curation_wrap .card');

    if (!$list || $cards?.length < 1) return;

    const isMobile = getResponsiveValue(true, false);
    const activateItem = (index, obj) => {
        $cards.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        })
    }

    $cards.forEach(card => {
        card.classList.remove('active');
        gsap.set(card, {clearProps: "opacity,y,scale,position,display"});
    });

    if (isMobile) {
        // NOTE: Mobile Case
        const CHANGE_DURATION = 0.3;
        const DELAY = 2.5;
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.curation_wrap',
                pin: true,
                start: 'top top',
                end: '+=' + window.innerHeight * DELAY * $cards.length,
                scrub: 1,
            }
        });

        // SETTING
        $cards.forEach(($card, index) => {
            timeline.addLabel('card' + (index + 1));
            timeline.set($card, {position: 'absolute', opacity: index === 0 ? 1 : 0, y: 0});
            const indexElement = $card.querySelector('.card_series_index .font_white');
            if (indexElement) {
                indexElement.textContent = (index + 1).toString();
            }

            if (index > 0) {
                timeline.to($cards[index-1], {...EASING, opacity: 0, duration: CHANGE_DURATION}, '<');
            }
            timeline.to($card, {...EASING, opacity: 1, duration: CHANGE_DURATION, onStart: () => activateItem(index), onReverseComplete: () => activateItem(index)});
            timeline.to({}, {duration: 2.5});
        });
        timeline.to({}, {duration: 2.5});

    } else {
        // NOTE: PC case
        const CARD_WIDTH = $cards[0].clientWidth;
        const CARD_COUNT = $cards.length;
        const CARD_GAP = parseInt(window.getComputedStyle($list).getPropertyValue('gap'));
        const SIDE_PADDING = parseInt(window.getComputedStyle($list).getPropertyValue('padding-left'));

        const SCROLL_WIDTH = window.innerWidth * 4;
        const listScroller = gsap.to($list, {
            // xPercent: 0.02791 * window.innerWidth - 90.2,
            xPercent: 0.03 * window.innerWidth - 90.2,
            ease: 'steps(600)',
            scrollTrigger: {
                trigger: $wrapper,
                start: 'top top',
                end: "+=" + SCROLL_WIDTH,
                pin: true,
                scrub: 1
            }
        });
        const getStartPoint = (index) => SIDE_PADDING + CARD_GAP + Math.ceil((window.innerWidth - (SIDE_PADDING + CARD_GAP + CARD_WIDTH * 0.5)) / CARD_COUNT) * index;
        $cards.forEach((item, index) => {
            const startPoint = getStartPoint(index);
            const endPoint = getStartPoint(index + 1);
            ScrollTrigger.create({
                trigger: item,
                containerAnimation: listScroller,
                start: 'left+=' + Math.min(1, index) * 20 + ' ' + startPoint,
                end: 'right+=40 ' + endPoint,
                onEnter: (obj) => activateItem(index, obj),
                onEnterBack: (obj) => activateItem(index, obj)
            });
        });
    }
} 