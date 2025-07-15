import { getResponsiveValue, EASING } from '../utils.js';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class ScrollableCardSection {
    /**
    * @param {object} options - The options for the component.
    * @param {string} options.wrapper - The main wrapper selector.
    * @param {string} options.list - The list container selector.
    * @param {string} options.cards - The card elements selector.
    */
    constructor(options) {
        // 1. DOM 요소 선택
        this.elements = {
            wrapper: document.querySelector(options.wrapper),
            list: document.querySelector(options.list),
            cards: document.querySelectorAll(options.cards),
        };

        // 2. 인스턴스에 ScrollTrigger와 Timeline 저장할 배열 초기화
        this.scrollTriggers = [];
        this.timeline = null;

        // 3. 필수 요소 없으면 실행 중단
        if (!this.elements.wrapper || !this.elements.list || this.elements.cards.length === 0) {
            console.warn('ScrollableCardSection: Required elements not found.');
            return;
        }

        // 4. 초기화 실행
        this.init();
    }

    init() {
        // 기존 애니메이션 정리 (HMR 이나 동적 생성 시 중요)
        this.destroy();

        // 반응형 체크
        const isMobile = getResponsiveValue(true, false);

        if (isMobile) {
            this._setupMobileAnimation();
        } else {
            this._setupPcAnimation();
        }
    }

    /** 현재 활성화된 카드를 표시하는 헬퍼 메서드 */
    _activateItem(activeIndex) {
        this.elements.cards.forEach((card, index) => {
            card.classList.toggle('active', index === activeIndex);
        });
    }

    /** 모바일 버전 애니메이션 설정 */
    _setupMobileAnimation() {
        const CHANGE_DURATION = 0.3;
        const DELAY = 2.5; // 스크롤 길이를 위한 지연 값

        this.timeline = gsap.timeline({
            scrollTrigger: {
                trigger: this.elements.wrapper,
                pin: true,
                start: 'top top',
                end: `+=${window.innerHeight * DELAY * this.elements.cards.length}`,
                scrub: 1,
            }
        });

        // 생성된 ScrollTrigger 인스턴스 저장
        this.scrollTriggers.push(this.timeline.scrollTrigger);

        this.elements.cards.forEach((card, index) => {
            this.timeline.addLabel(`card${index + 1}`);
            this.timeline.set(card, { position: 'absolute', opacity: index === 0 ? 1 : 0, y: 0 });

            if (index > 0) {
                this.timeline.to(this.elements.cards[index - 1], { ...EASING, opacity: 0, duration: CHANGE_DURATION }, '<');
            }
            this.timeline.to(card, {
                ...EASING,
                opacity: 1,
                duration: CHANGE_DURATION,
                onStart: () => this._activateItem(index),
                onReverseComplete: () => this._activateItem(index)
            });
            this.timeline.to({}, { duration: DELAY }); // 각 카드 사이의 스크롤 간격
        });
    }

    /** PC 버전 애니메이션 설정 */
    _setupPcAnimation() {
        const { list, cards, wrapper } = this.elements;
        const CARD_WIDTH = cards[0].clientWidth;
        const CARD_COUNT = cards.length;
        const CARD_GAP = parseInt(window.getComputedStyle(list).getPropertyValue('gap')) || 0;
        const SIDE_PADDING = parseInt(window.getComputedStyle(list).getPropertyValue('padding-left')) || 0;

        const listScroller = gsap.to(list, {
            x: () => -(list.scrollWidth - wrapper.clientWidth), // xPercent 보다 명확한 계산
            ease: 'none',
            scrollTrigger: {
                trigger: wrapper,
                start: 'top top',
                end: () => `+=${list.scrollWidth - wrapper.clientWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true, // 리사이즈 시 값 재계산
            }
        });

        this.scrollTriggers.push(listScroller.scrollTrigger);

        cards.forEach((card, index) => {
            const st = ScrollTrigger.create({
                trigger: card,
                containerAnimation: listScroller,
                start: 'left center',
                end: 'right center',
                onToggle: (self) => self.isActive && this._activateItem(index),
            });
            this.scrollTriggers.push(st); // 개별 ScrollTrigger도 저장
        });

        // 초기 상태 활성화
        this._activateItem(0);
    }

    /** 생성된 모든 GSAP 인스턴스를 제거하는 메서드 */
    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        if (this.timeline) {
            this.timeline.kill();
        }
        // GSAP이 추가한 스타일 클리어
        gsap.set(this.elements.cards, { clearProps: "all" });
        // 'active' 클래스 제거
        this.elements.cards.forEach(card => card.classList.remove('active'));
    }

}