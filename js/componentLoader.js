/**
 * 컴포넌트 로더 모듈
 * HTML 컴포넌트들을 동적으로 로드하여 DOM에 삽입하는 기능을 제공합니다.
 */

/**
 * 컴포넌트 정보 설정
 */
const COMPONENTS = {
    header: {
        path: 'components/header.html',
        container: '#header-container'
    },
    entry: {
        path: 'components/sections/entry.html',
        container: '#entry-container'
    },
    intro: {
        path: 'components/sections/intro.html',
        container: '#intro-container'
    },
    curation: {
        path: 'components/sections/curation.html',
        container: '#curation-container'
    },
    slogan: {
        path: 'components/sections/slogan.html',
        container: '#slogan-container'
    },
    promise: {
        path: 'components/sections/promise.html',
        container: '#promise-container'
    },
    mission: {
        path: 'components/sections/mission.html',
        container: '#mission-container'
    },
    video: {
        path: 'components/sections/video.html',
        container: '#video-container'
    },
    share: {
        path: 'components/sections/share.html',
        container: '#share-container'
    }
};

/**
 * 단일 컴포넌트를 로드하는 함수
 * @param {string} componentName - 컴포넌트 이름
 * @returns {Promise<void>}
 */
export const loadComponent = async (componentName) => {
    const component = COMPONENTS[componentName];
    if (!component) {
        console.error(`Component "${componentName}" not found`);
        return;
    }

    try {
        const response = await fetch(component.path);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${componentName}`);
        }
        
        const html = await response.text();
        const container = document.querySelector(component.container);
        
        if (!container) {
            console.error(`Container "${component.container}" not found for component "${componentName}"`);
            return;
        }
        
        container.innerHTML = html;
        console.log(`Component "${componentName}" loaded successfully`);
    } catch (error) {
        console.error(`Error loading component "${componentName}":`, error);
    }
};

/**
 * 여러 컴포넌트를 병렬로 로드하는 함수
 * @param {string[]} componentNames - 로드할 컴포넌트 이름들
 * @returns {Promise<void>}
 */
export const loadComponents = async (componentNames) => {
    const loadPromises = componentNames.map(name => loadComponent(name));
    await Promise.all(loadPromises);
};

/**
 * 모든 컴포넌트를 로드하는 함수
 * @returns {Promise<void>}
 */
export const loadAllComponents = async () => {
    const allComponentNames = Object.keys(COMPONENTS);
    await loadComponents(allComponentNames);
};

/**
 * 컴포넌트를 순차적으로 로드하는 함수 (순서가 중요한 경우)
 * @param {string[]} componentNames - 로드할 컴포넌트 이름들
 * @returns {Promise<void>}
 */
export const loadComponentsSequentially = async (componentNames) => {
    for (const name of componentNames) {
        await loadComponent(name);
    }
};

/**
 * 컴포넌트가 로드되었는지 확인하는 함수
 * @param {string} componentName - 확인할 컴포넌트 이름
 * @returns {boolean}
 */
export const isComponentLoaded = (componentName) => {
    const component = COMPONENTS[componentName];
    if (!component) return false;
    
    const container = document.querySelector(component.container);
    return container && container.innerHTML.trim() !== '';
};

/**
 * 컴포넌트를 언로드하는 함수
 * @param {string} componentName - 언로드할 컴포넌트 이름
 */
export const unloadComponent = (componentName) => {
    const component = COMPONENTS[componentName];
    if (!component) {
        console.error(`Component "${componentName}" not found`);
        return;
    }
    
    const container = document.querySelector(component.container);
    if (container) {
        container.innerHTML = '';
        console.log(`Component "${componentName}" unloaded successfully`);
    }
};

/**
 * 컴포넌트 로딩 상태를 확인하는 함수
 * @returns {Object} 각 컴포넌트의 로딩 상태
 */
export const getComponentsStatus = () => {
    const status = {};
    Object.keys(COMPONENTS).forEach(name => {
        status[name] = isComponentLoaded(name);
    });
    return status;
};

/**
 * 컴포넌트 로딩 완료 이벤트 발생
 * @param {string} componentName - 로드된 컴포넌트 이름
 */
const dispatchComponentLoadEvent = (componentName) => {
    const event = new CustomEvent('componentLoaded', {
        detail: { componentName }
    });
    document.dispatchEvent(event);
};

/**
 * 모든 컴포넌트 로딩 완료 이벤트 발생
 */
const dispatchAllComponentsLoadEvent = () => {
    const event = new CustomEvent('allComponentsLoaded');
    document.dispatchEvent(event);
}; 