import { initEntryAnimation } from './animations/entry.js';
import { initIntroAnimation } from './animations/intro.js';
import { initCurationAnimation } from './animations/curation.js';
import { initSloganAnimation } from './animations/slogan.js';
import { initPromiseAnimation } from './animations/promise.js';
import { initMissionAnimation } from './animations/mission.js';
import { initFilmAnimation } from './animations/film.js';
import { initEventAnimation } from './animations/event.js';
import { initNavigation } from './navigation.js';
import { showToast } from './toast.js';
import { shareToKakao, shareToFacebook, shareToTwitter, copyUrl } from './share.js';
import { debounce } from './utils.js';

let preWidth = window.innerWidth;
function initAnimation() {
    // clear
    if (window.gsap && window.gsap.globalTimeline) {
        window.gsap.globalTimeline.clear();
    }
    if (window.ScrollTrigger && window.ScrollTrigger.getAll) {
        window.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
    initEntryAnimation();
    initIntroAnimation();
    initCurationAnimation(); // SectionAnimationBase 기반 scenario 방식
    initSloganAnimation();
    initPromiseAnimation();
    initMissionAnimation();
    initFilmAnimation();
    initEventAnimation();
    preWidth = window.innerWidth;
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimation();

    // 공유 버튼 이벤트 바인딩
    const kakaoBtn = document.querySelector('.btn_kakao');
    if (kakaoBtn) kakaoBtn.addEventListener('click', shareToKakao);
    const facebookBtn = document.querySelector('.btn_facebook');
    if (facebookBtn) facebookBtn.addEventListener('click', shareToFacebook);
    const twitterBtn = document.querySelector('.btn_twitter');
    if (twitterBtn) twitterBtn.addEventListener('click', shareToTwitter);
    const urlBtn = document.querySelector('.btn_url');
    if (urlBtn) urlBtn.addEventListener('click', () => {
        copyUrl();
        showToast('URL이 복사되었습니다');
    });

    window.addEventListener('resize', debounce(() => {
        const width = window.innerWidth;
        if (preWidth === width) return; // 가로 사이즈만 체크
        initAnimation();
    }, 200));
}); 