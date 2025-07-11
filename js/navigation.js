/**
 * 네비게이션 모듈
 */

import { debounce } from './utils.js';

/**
 * 네비게이션을 초기화하는 함수
 */
export const initNavigation = () => {
    let preWidth = window.innerWidth;

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - windowHeight)) * 100;

        // 스크롤 진행률에 따른 네비게이션 업데이트
        updateNavigationProgress(scrollPercent);
    };

    const updateNavigationProgress = (progress) => {
        const navProgress = document.querySelector('.nav-progress');
        if (navProgress) {
            navProgress.style.width = `${progress}%`;
        }
    };

    const handleResize = debounce(() => {
        const currentWidth = window.innerWidth;
        if (preWidth !== currentWidth) {
            preWidth = currentWidth;
            // 리사이즈 시 필요한 업데이트
            updateLayout();
        }
    }, 250);

    const updateLayout = () => {
        // 레이아웃 업데이트 로직
        console.log('Layout updated');
    };

    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // 초기 호출
    handleScroll();
};

/**
 * 네비게이션 정리 함수
 */
export const cleanupNavigation = () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
}; 