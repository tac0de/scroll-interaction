/**
 * Toast 알림 모듈
 */

/**
 * Toast 알림을 표시하는 함수
 * @param {string} message - 표시할 메시지
 * @param {number} duration - 표시 시간 (밀리초, 기본값: 3000)
 */
export const showToast = (message, duration = 3000) => {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.warn('Toast element not found');
        return;
    }

    toast.textContent = message;
    toast.classList.add('show');
    toast.setAttribute('aria-live', 'assertive');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.removeAttribute('aria-live');
    }, duration);
};

/**
 * 성공 메시지를 표시하는 함수
 * @param {string} message - 표시할 메시지
 */
export const showSuccess = (message) => {
    showToast(message);
};

/**
 * 에러 메시지를 표시하는 함수
 * @param {string} message - 표시할 메시지
 */
export const showError = (message) => {
    showToast(message);
};

/**
 * 경고 메시지를 표시하는 함수
 * @param {string} message - 표시할 메시지
 */
export const showWarning = (message) => {
    showToast(message);
};

/**
 * 정보 메시지를 표시하는 함수
 * @param {string} message - 표시할 메시지
 */
export const showInfo = (message) => {
    showToast(message);
}; 