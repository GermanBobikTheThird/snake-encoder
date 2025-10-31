import * as constants from './constants.js';
import { encodeSnake, formatMatrix, getOptimalMatrixSizes } from './snakeCoding.js';

const UIHandler = (() => {
    let updateTimeout;
    let scrollTimeout;

    const elements = {
        sentence: document.getElementById('sentence'),
        n: document.getElementById('n'),
        result: document.getElementById('result'),
        copyBtn: document.getElementById('copy-btn'),
        clearBtn: document.getElementById('clear-btn'),
        numberUp: document.querySelector('.number-up'),
        numberDown: document.querySelector('.number-down'),
        optimalValues: document.getElementById('optimal-values'),
        floatingHeader: document.getElementById('floating-header'),
        mainHeader: document.querySelector('header'),
    };

    const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const mainHeader = elements.mainHeader;
            const floatingHeader = elements.floatingHeader;
            const headerRect = mainHeader.getBoundingClientRect();
            
            if (headerRect.bottom < 0) {
                floatingHeader.classList.add('visible');
            } else {
                floatingHeader.classList.remove('visible');
            }
        }, 10);
    };

    const updateOptimalValues = () => {
        const sentence = elements.sentence.value.trim();
        const text = sentence.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '').toUpperCase();
        const optimalSizes = getOptimalMatrixSizes(text.length, constants.DEFAULT_NUMBER_OF_OPTIMAL_VALUES);

        const container = elements.optimalValues;
        
        if (!optimalSizes || optimalSizes.length === 0) {
            container.innerHTML = '';
            return;
        }

        const fragment = document.createDocumentFragment();
        const label = document.createElement('span');
        label.textContent = 'оптимальные значения: ';
        fragment.appendChild(label);

        optimalSizes.forEach((size, index) => {
            const span = document.createElement('span');
            span.textContent = size;
            span.className = 'optimal-value';
            span.addEventListener('click', () => {
                elements.n.value = size;
                updateResult();
            });

            fragment.appendChild(span);

            if (index < optimalSizes.length - 1) {
                fragment.appendChild(document.createTextNode(', '));
            }
        });

        container.innerHTML = '';
        container.appendChild(fragment);
    };

    const updateResult = () => {
        const sentence = elements.sentence.value.trim();
        const matrixHeight = parseInt(elements.n.value);

        if (!sentence || isNaN(matrixHeight) || matrixHeight < constants.NUMBER_INPUT.MIN) {
            requestAnimationFrame(() => {
                elements.result.textContent = constants.DEFAULT_RESULT_MESSAGE;
                updateCopyButton();
            });
            return;
        }

        requestAnimationFrame(() => {
            const result = encodeSnake(sentence, matrixHeight);
            elements.result.textContent = formatMatrix(result);
            resetCopyButton();
            updateCopyButton();
        });
    };

    const debouncedUpdate = () => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            updateResult();
            updateOptimalValues();
        }, constants.UPDATE_DEBOUNCE_DELAY);
    };

    const updateCopyButton = () => {
        const resultText = elements.result.textContent;
        const isEmpty = [constants.DEFAULT_RESULT_MESSAGE, constants.EMPTY_RESULT_MESSAGE].includes(resultText);
        elements.copyBtn.disabled = isEmpty;
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(elements.result.textContent);
            elements.copyBtn.textContent = 'Скопировано';
            elements.copyBtn.classList.add('copied');
        } catch (err) {
            console.error('Ошибка копирования: ', err);
        }
    };

    const resetCopyButton = () => {
        elements.copyBtn.textContent = 'Скопировать результат';
        elements.copyBtn.classList.remove('copied');
    };

    const clearInput = (e) => {
        e.preventDefault();
        elements.sentence.value = '';
        elements.sentence.focus();
        updateResult();
        updateOptimalValues();
        elements.clearBtn.blur();
    };

    const changeMatrixHeight = (delta) => {
        let currentValue = parseInt(elements.n.value) || constants.NUMBER_INPUT.MIN;
        const newValue = Math.max(constants.NUMBER_INPUT.MIN,
                         Math.min(constants.NUMBER_INPUT.MAX, currentValue + delta));
        elements.n.value = newValue;
        updateResult();
    };

    const validateNumberInput = (e) => {
        if (e.data && !/\d/.test(e.data)) {
            e.preventDefault();
            return;
        }

        const newValue = elements.n.value + (e.data || '');
        if (newValue.length > 3 ||
            newValue.startsWith('0') ||
            parseInt(newValue) > constants.NUMBER_INPUT.MAX) {
            e.preventDefault();
        }
    };

    const init = () => {
        elements.sentence.addEventListener('input', debouncedUpdate);
        elements.n.addEventListener('input', debouncedUpdate);
        elements.n.addEventListener('beforeinput', validateNumberInput);
        elements.numberUp.addEventListener('click', () => changeMatrixHeight(1));
        elements.numberDown.addEventListener('click', () => changeMatrixHeight(-1));
        elements.copyBtn.addEventListener('click', copyToClipboard);
        elements.clearBtn.addEventListener('click', clearInput);
        elements.clearBtn.addEventListener('mousedown', e => e.preventDefault());

        window.addEventListener('scroll', handleScroll);

        updateResult();
        updateOptimalValues();
    };

    return { init };
})();

export default UIHandler;
