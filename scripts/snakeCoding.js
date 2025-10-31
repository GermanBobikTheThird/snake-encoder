import * as constants from './constants.js';

export const getOptimalMatrixSizes = (textLength, numberOfValues = constants.DEFAULT_NUMBER_OF_OPTIMAL_VALUES) => {
    const length = textLength;

    if (!length || length > constants.NUMBER_INPUT.MAX) return null;

    const optimalSizes = [];
    for (let size = 2; size < length; size++) {
        if (optimalSizes.length >= numberOfValues) break;
        if (length % size === 0) optimalSizes.push(size);
    }

    return optimalSizes;
};

export const encodeSnake = (sentence, matrixHeight) => {
    if (matrixHeight <= 0) return [];

    const words = sentence.match(/[a-zA-Zа-яА-ЯёЁ]+/g) || [];
    const text = words.join('').toUpperCase();

    if (!text) return [];

    const textLength = text.length;
    if (matrixHeight === 1) return [text];

    const matrixWidth = Math.ceil(textLength / matrixHeight);
    const matrix = Array(matrixHeight).fill('');
    let charIndex = 0;

    for (let col = 0; col < matrixWidth; col++) {
        if (col % 2 === 0) {
            for (let row = 0; row < matrixHeight && charIndex < textLength; row++) {
                matrix[row] += text[charIndex++];
            }
        } else {
            for (let row = matrixHeight - 1; row >= 0 && charIndex < textLength; row--) {
                matrix[row] += text[charIndex++];
            }
        }
    }

    return matrix;
};

export const formatMatrix = (matrix) => {
    if (!matrix.length) return constants.EMPTY_RESULT_MESSAGE;
    return matrix.map(row => row.split('').join(' ')).join('\n');
};
