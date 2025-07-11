// 공유 기능 모듈

export function getShareData() {
    return {
        title: document.title,
        url: window.location.href
    };
}

export function copyUrl() {
    const { url } = getShareData();
    navigator.clipboard.writeText(url);
}

export function shareToKakao() {
    const { title, url } = getShareData();
    if (window.Kakao && window.Kakao.Link) {
        window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title,
                description: '',
                imageUrl: '',
                link: { mobileWebUrl: url, webUrl: url }
            },
            buttons: [{ title: '웹으로 보기', link: { mobileWebUrl: url, webUrl: url } }]
        });
    }
}

export function shareToFacebook() {
    const { url } = getShareData();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
}

export function shareToTwitter() {
    const { title, url } = getShareData();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
} 