// 공통 유틸 함수 모듈

export function getResponsiveValue(mobile, desktop) {
    return window.innerWidth <= 985 ? mobile : (desktop ?? mobile);
}

export const EASING = {
    ease: 'power2.out',
    
};

export function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
} 