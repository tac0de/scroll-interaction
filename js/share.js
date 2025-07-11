/**
 * 소셜 공유 모듈
 */

import { showToast } from './toast.js';

/**
 * 공유 데이터를 가져오는 함수
 * @returns {Object} 공유 데이터
 */
const getShareData = () => {
    const url = window.location.href.split(/[?#]/)[0];
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.content || '';
    const image = document.querySelector('meta[property="og:image"]')?.content || '';
    const imageKakao = document.querySelector('meta[property="og:image:kakao"]')?.content || '';
    return { url, title, description, image, imageKakao };
};

/**
 * URL을 클립보드에 복사하는 함수
 * @param {string} utmSuffix - UTM 파라미터 (옵션)
 */
export const copyUrl = (utmSuffix = '') => {
    const { url } = getShareData();
    const fullUrl = url + utmSuffix;

    navigator.clipboard.writeText(fullUrl)
        .then(() => showToast('URL이 복사되었습니다.'))
        .catch(() => showToast('URL 복사에 실패했습니다. 주소창에서 직접 복사하세요.'));
};

/**
 * 카카오톡으로 공유하는 함수
 * @param {string} utmSuffix - UTM 파라미터 (옵션)
 */
export const shareToKakao = (utmSuffix = '') => {
    const { url, title, description, image, imageKakao } = getShareData();
    const kakaoLinkUrl = url + utmSuffix;

    // 중앙일보 앱 내에서 실행되는 경우
    if (/joongangilbo/.test(navigator.userAgent.toLowerCase())) {
        location.href = `joongangilbo://article/share?url=${encodeURIComponent(kakaoLinkUrl)}&title=${encodeURIComponent(title)}&img=${encodeURIComponent(image)}`;
        return;
    }

    // 웹에서 실행되는 경우
    if (window.Kakao) {
        if (!window.Kakao.Auth) {
            window.Kakao.init('62547e7c5e294f7836425fb3a755e4a1');
        }

        window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title,
                description,
                imageUrl: imageKakao,
                link: {
                    mobileWebUrl: kakaoLinkUrl,
                    webUrl: kakaoLinkUrl,
                },
            },
            buttons: [
                {
                    title: '웹으로 보기',
                    link: {
                        mobileWebUrl: kakaoLinkUrl,
                        webUrl: kakaoLinkUrl,
                    },
                },
            ],
            fail: () => alert('지원하지 않는 기기입니다.'),
        });
    } else {
        console.error('카카오 SDK가 로드되지 않았습니다.');
    }
};

/**
 * 페이스북으로 공유하는 함수
 * @param {string} utmSuffix - UTM 파라미터 (옵션)
 */
export const shareToFacebook = (utmSuffix = '') => {
    const { url, title, description } = getShareData();
    const shareUrl = `http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url + utmSuffix)}&text=${encodeURIComponent(title + '\n' + description)}`;
    window.open(shareUrl, 'Share_Facebook', 'width=550,height=500');
};

/**
 * 트위터로 공유하는 함수
 * @param {string} utmSuffix - UTM 파라미터 (옵션)
 */
export const shareToTwitter = (utmSuffix = '') => {
    const { url, title, description } = getShareData();
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url + utmSuffix)}&text=${encodeURIComponent(title + '\n' + description)}`;
    window.open(shareUrl, 'Share_Twitter', 'width=550,height=500');
};

/**
 * 공유 모듈을 초기화하는 함수
 * @param {Object} customUtms - 커스텀 UTM 파라미터
 */
export const initShare = (customUtms = {}) => {
    const utms = {
        kakao: '',
        facebook: '',
        twitter: '',
        copyUrl: '',
        ...customUtms
    };

    const shareButtons = [
        { selector: '.btn_url', handler: () => copyUrl(utms.copyUrl) },
        { selector: '.btn_facebook', handler: () => shareToFacebook(utms.facebook) },
        { selector: '.btn_twitter', handler: () => shareToTwitter(utms.twitter) },
        { selector: '.btn_kakao', handler: () => shareToKakao(utms.kakao) },
    ];

    shareButtons.forEach(({ selector, handler }) => {
        const button = document.querySelector(selector);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
}; 