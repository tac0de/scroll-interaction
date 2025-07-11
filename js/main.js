/**
 * 메인 애플리케이션 모듈
 * 일반 버전과 컴포넌트 기반 버전 모두 지원합니다.
 */

import { initShare } from './share.js';
import { initNavigation } from './navigation.js';
import { initEntryAnimation } from './animations/entry.js';
import { initIntroAnimation } from './animations/intro.js';
import { initCurationAnimation } from './animations/curation.js';
import { initSloganAnimation } from './animations/slogan.js';
import { initPromiseAnimation } from './animations/promise.js';
import { initMissionAnimation } from './animations/mission.js';

/**
 * 애플리케이션 초기화 함수 (일반 버전)
 */
const initApp = () => {
    // 공유 기능 초기화
    initShare();
    
    // 네비게이션 초기화
    initNavigation();
    
    // 애니메이션 초기화
    initAnimations();
};

/**
 * 컴포넌트 기반 애플리케이션 초기화 함수
 * 컴포넌트 로더와 함께 사용될 때 호출됩니다.
 */
const initComponentApp = () => {
    // 기본 모듈 초기화
    initShare();
    initNavigation();
    
    console.log('컴포넌트 기반 애플리케이션 초기화 완료');
};

/**
 * 모든 애니메이션 초기화 함수
 */
const initAnimations = () => {
    initEntryAnimation();
    initIntroAnimation();
    initCurationAnimation();
    initSloganAnimation();
    initPromiseAnimation();
    initMissionAnimation();
};

/**
 * DOM 로드 완료 후 애플리케이션 초기화 (일반 버전)
 */
document.addEventListener('DOMContentLoaded', initApp);

// 모듈 내보내기
export { 
    initApp, 
    initAnimations,
    initComponentApp,
    initEntryAnimation,
    initIntroAnimation,
    initCurationAnimation,
    initSloganAnimation,
    initPromiseAnimation,
    initMissionAnimation
}; 