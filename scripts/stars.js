import * as constants from './constants.js';

const StarManager = (() => {
    let resizeTimeout;

    const getStarCount = () => {
        const isMobile = constants.MOBILE_DEVICE_REGEX.test(navigator.userAgent);
        const { innerWidth: width, innerHeight: height } = window;

        if (isMobile || width < constants.BREAKPOINT) {
            return Math.min(constants.MAX_STARS_MOBILE, Math.floor((width * height) / constants.DENSITY_DIVIDER_MOBILE));
        }

        return Math.min(constants.MAX_STARS_DESKTOP, Math.floor((width * height) / constants.DENSITY_DIVIDER_DESKTOP));
    };

    const createStars = () => {
        const container = document.getElementById('stars');
        const starCount = getStarCount();
        
        container.innerHTML = '';

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * constants.ANIMATION_DELAY_MAX}s`;
            star.style.animationDuration = `${constants.ANIMATION_DURATION.MIN + Math.random() * (constants.ANIMATION_DURATION.MAX - constants.ANIMATION_DURATION.MIN)}s`;
            container.appendChild(star);
        }
    };

    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createStars, constants.RESIZE_DEBOUNCE_DELAY);
    };

    const init = () => {
        createStars();
        window.addEventListener('resize', handleResize);
    };

    return { init };
})();

export default StarManager;
