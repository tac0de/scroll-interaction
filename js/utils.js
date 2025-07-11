/**
 * 유틸리티 함수들을 모음
 */

/**
 * 함수 실행을 지연시키는 디바운스 함수
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 지연 시간 (밀리초)
 * @returns {Function} 디바운스된 함수
 */
export const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

/**
 * 반응형 값을 가져오는 함수
 * @param {*} mobile - 모바일 값
 * @param {*} desktop - 데스크톱 값 (옵션)
 * @returns {*} 현재 화면 크기에 따른 값
 */
export const getResponsiveValue = (mobile, desktop) => {
    const currentWidth = window.innerWidth;
    if (currentWidth <= 985) return mobile;
    return desktop ?? mobile;
};

/**
 * 애니메이션 이징 설정
 */
export const EASING = { ease: "steps(50)" };

/**
 * 현재 화면 크기가 모바일인지 확인
 * @returns {boolean} 모바일 여부
 */
export const isMobile = () => window.innerWidth <= 985;

/**
 * 현재 화면 크기가 데스크톱인지 확인
 * @returns {boolean} 데스크톱 여부
 */
export const isDesktop = () => window.innerWidth > 985;

/**
 * 요소가 뷰포트에 있는지 확인
 * @param {HTMLElement} element - 확인할 요소
 * @returns {boolean} 뷰포트에 있는지 여부
 */
export const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

/**
 * 요소 선택자 유틸리티
 * @param {string} selector - CSS 선택자
 * @param {HTMLElement} context - 검색할 컨텍스트 (기본값: document)
 * @returns {HTMLElement|null} 선택된 요소
 */
export const $ = (selector, context = document) => {
    return context.querySelector(selector);
};

/**
 * 여러 요소 선택자 유틸리티
 * @param {string} selector - CSS 선택자
 * @param {HTMLElement} context - 검색할 컨텍스트 (기본값: document)
 * @returns {NodeList} 선택된 요소들
 */
export const $$ = (selector, context = document) => {
    return context.querySelectorAll(selector);
}; 