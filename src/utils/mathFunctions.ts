import {DfcCoeffs} from './types';

export const cumtrapz = (y: number[], x: number[]): number[] => {
    if (y.length !== x.length) {
        throw new Error('Input arrays y and x must have the same length.');
    }

    const integral: number[] = [0];
    for (let i = 1; i < y.length; i++) {
        const dx = x[i] - x[i - 1];
        const avgHeight = (y[i] + y[i - 1]) / 2;
        const area = dx * avgHeight;
        integral.push(integral[i - 1] + area);
    }

    return integral;
}

export const columnStack = (...arrays: number[][]) => {
    if (arrays.length === 0) {
        throw new Error('At least one array must be provided.');
    }

    const lengthOfFirst = arrays[0].length;
    for (const arr of arrays) {
        if (arr.length !== lengthOfFirst) {
            throw new Error('All input arrays must have the same length.');
        }
    }

    const Y = [];
    for (let i = 0; i < lengthOfFirst; i++) {
        const row = arrays.map(arr => arr[i]);
        Y.push(row);
    }

    return Y;
}

export const vstack = (...arrays: number[][][]): number[][] => {
    // Ensure all arrays have the same number of columns
    const columnCount = arrays[0][0].length;
    for (const array of arrays) {
        for (const row of array) {
            if (row.length !== columnCount) {
                throw new Error('All input arrays must have rows of the same length.');
            }
        }
    }

    // Concatenate arrays
    let stackedArray: number[][] = [];
    for (const array of arrays) {
        stackedArray = stackedArray.concat(array);
    }

    return stackedArray;
}

export const stringifyDfcEqn = (expCoeffs: DfcCoeffs) => {
 return `f(x) = ${expCoeffs.p0/expCoeffs.lambda0} * e^(${expCoeffs.lambda0}x) + ${expCoeffs.p1/expCoeffs.lambda1} * e^(${expCoeffs.lambda1} * x)`
}
