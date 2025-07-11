import { getResponsiveValue } from './utils.js';

/**
 * 네비게이션 바의 스크롤/고정/페이드 동작을 담당하는 함수 (intro_new.js의 setNavigation 1:1 이관)
 */
export function initNavigation() {
    let lastScrollY = 0;
    const navigationBar = document.querySelector('.event_nav');
    if (!navigationBar) return;

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const scrollDiff = scrollY - lastScrollY;
        const isMobile = getResponsiveValue(true, false);

        if (!isMobile) {
            if (!navigationBar.classList.contains('fixed')) {
                navigationBar.classList.add('fixed');
            }
            navigationBar.classList.remove('fade_out');
            navigationBar.classList.add('fade_in');
            navigationBar.style.transform = 'translateY(0)';
        } else {
            if (scrollY <= 0) {
                navigationBar.classList.remove('fade_in', 'fade_out', 'fixed');
                navigationBar.style.transform = 'translateY(0)';
            } else {
                if (!navigationBar.classList.contains('fixed')) {
                    navigationBar.classList.add('fixed');
                }
                if (Math.abs(scrollDiff) > 5) {
                    if (scrollDiff > 0) {
                        navigationBar.classList.add('fade_in');
                        navigationBar.classList.remove('fade_out');
                        navigationBar.style.transform = 'translateY(0)';
                    } else {
                        navigationBar.classList.add('fade_out');
                        navigationBar.classList.remove('fade_in');
                        navigationBar.style.transform = 'translateY(-100%)';
                    }
                }
            }
        }
        lastScrollY = scrollY;
    };

    handleScroll();

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50);
    }, { passive: true });
} 