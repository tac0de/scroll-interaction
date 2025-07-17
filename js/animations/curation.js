/*
 * [실사용 예시] SectionAnimationBase 및 시나리오 헬퍼(set, to, addLabel, containerAnimation, scrollTriggerStep) 활용 예시.
 * - 본 파일은 실제 섹션 애니메이션에서 시나리오 헬퍼를 어떻게 사용하는지 보여줍니다.
 * - 시나리오 선언은 배열 기반이며, 필요시 고급 헬퍼(each, group, ifStep, fadeInCards 등)와 ScenarioBuilder도 활용 가능.
 * - 전체 구조/확장/고급 사용법은 doc/GSAP-OOP-Functional-Pattern.md 참고.
 */
import { SectionAnimationBase, ScenarioBuilder, addLabel, set, to, containerAnimation, scrollTriggerStep, each } from '../modules/SectionAnimationBase.js';
import { getResponsiveValue, EASING } from '../utils.js';

class CurationSection extends SectionAnimationBase {
  constructor(context) {
    super(context);
    // 주요 DOM 요소를 미리 저장합니다.
    this.$wrapper = document.querySelector('.curation_wrap');
    this.$list = document.querySelector('.card_container');
    this.$cards = Array.from(document.querySelectorAll('.curation_wrap .card'));
    this.isMobile = getResponsiveValue(true, false);

    // 카드 인덱스(1,2,3...)를 각 카드에 표시합니다.
    this.$cards.forEach(($card, index) => {
      const indexElement = $card.querySelector('.card_series_index .font_white');
      if (indexElement) indexElement.textContent = (index + 1).toString();
    });

    // 모든 카드의 스타일/상태를 초기화합니다.
    this.$cards.forEach(card => {
      card.classList.remove('active');
      gsap.set(card, {clearProps: 'opacity,y,scale,position,display'});
    });
  }

  // 특정 인덱스의 카드를 활성화(하이라이트)합니다.
  activateItem(index) {
    this.$cards.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  buildScenario() {
    if (this.isMobile) {
      // === 모바일: 카드를 하나씩 순서대로 보여주는 애니메이션 ===
      const CHANGE_DURATION = 0.3; // 카드 전환 애니메이션 시간(초)
      const DELAY = 2.5;           // 각 카드가 머무는 시간(초)
      const builder = new ScenarioBuilder();

      // 각 카드를 순회하며 애니메이션 step을 추가합니다.
      each(this.$cards, ($card, index) => {
        // 1. 카드별로 label(타임라인 내 구분점) 추가
        builder.addLabel('card' + (index + 1));
        // 2. 해당 카드를 화면에 쌓기(absolute) 및 첫 번째 카드만 보이게
        builder.set($card, { position: 'absolute', opacity: index === 0 ? 1 : 0, y: 0 });
        // 3. 이전 카드는 사라지게(투명도 0)
        if (index > 0) {
          builder.to(this.$cards[index - 1], null, '<', { ...EASING, opacity: 0, duration: CHANGE_DURATION });
        }
        // 4. 현재 카드는 나타나게(투명도 1), 활성화 콜백
        builder.to($card, null, undefined, {
          ...EASING,
          opacity: 1,
          duration: CHANGE_DURATION,
          onStart: () => this.activateItem(index), // 카드 활성화
          onReverseComplete: () => this.activateItem(index) // 되감기 시에도 활성화
        });
        // 5. 다음 카드로 넘어가기 전 대기 시간
        builder.to({}, null, undefined, { duration: DELAY });
      });
      // 마지막 카드 후에도 잠시 대기
      builder.to({}, null, undefined, { duration: DELAY });
      return builder.build();
    } else {
      // === PC: 카드 리스트 전체를 가로로 스크롤시키는 애니메이션 ===
      const CARD_WIDTH = this.$cards[0].clientWidth;
      const CARD_COUNT = this.$cards.length;
      const CARD_GAP = parseInt(window.getComputedStyle(this.$list).getPropertyValue('gap'));
      const SIDE_PADDING = parseInt(window.getComputedStyle(this.$list).getPropertyValue('padding-left'));
      const SCROLL_WIDTH = window.innerWidth * 4;
      // 각 카드의 시작 위치 계산 함수
      const getStartPoint = (index) => SIDE_PADDING + CARD_GAP + Math.ceil((window.innerWidth - (SIDE_PADDING + CARD_GAP + CARD_WIDTH * 0.5)) / CARD_COUNT) * index;
      const builder = new ScenarioBuilder();

      // 1. 카드 리스트 전체를 가로로 움직이는 containerAnimation 등록
      builder.containerAnimation(this.$list, {
        xPercent: 0.03 * window.innerWidth - 90.2, // 리스트가 이동할 거리(픽셀)
        ease: 'steps(600)', // 부드러운 스크롤 효과
        scrollTrigger: {
          trigger: this.$wrapper, // 스크롤 트리거 기준 요소
          start: 'top top',
          end: '+=' + SCROLL_WIDTH,
          pin: true, // 스크롤 시 고정
          scrub: 1   // 스크롤과 애니메이션 동기화
        }
      }, 'listScroller');

      // 2. 각 카드별로 스크롤 위치에 따라 활성화 트리거 등록
      this.$cards.forEach((item, index) => {
        const startPoint = getStartPoint(index);
        const endPoint = getStartPoint(index + 1);
        builder.scrollTriggerStep(item, {
          containerAnimation: 'listScroller', // 위에서 만든 containerAnimation과 연동
          start: 'left+=' + Math.min(1, index) * 20 + ' ' + startPoint, // 카드가 등장할 스크롤 위치
          end: 'right+=40 ' + endPoint, // 카드가 사라질 스크롤 위치
          onEnter: () => this.activateItem(index), // 카드 활성화
          onEnterBack: () => this.activateItem(index) // 스크롤 되감기 시에도 활성화
        });
      });
      return builder.build();
    }
  }

  get scrollTrigger() {
    if (this.isMobile) {
      // 모바일: 전체 카드 길이에 따라 스크롤 길이 결정
      return {
        trigger: '.curation_wrap',
        pin: true,
        start: 'top top',
        end: '+=' + window.innerHeight * 2.5 * this.$cards.length,
        scrub: 1,
      };
    }
    return undefined;
  }
}

export function initCurationAnimation() {
  const curation = new CurationSection();
  curation.init();
} 