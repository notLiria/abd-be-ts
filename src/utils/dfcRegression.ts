import * as math from 'mathjs';
import Matrix, {EigenvalueDecomposition, pseudoInverse} from 'ml-matrix';
import * as curveFit from './curveFit';
import {columnStack, cumtrapz, vstack} from './mathFunctions';

import type {Point} from './types';

export const fitPoly = (points: Point[], degree: number): number[]  => {
    const n = points.length;
    const X: number[][] = Array(n).fill([]).map(() => Array(degree + 1).fill(0));
    const y: number[] = points.map(p => p.y);

    // Populate the X matrix
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= degree; j++) {
            X[i][j] = Math.pow(points[i].x, j);
        }
    }

    const XT = math.transpose(X);
    const XT_X = math.multiply(XT, X);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const XT_y = math.multiply(XT, y);

    const coefficients = math.lusolve(XT_X, XT_y);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return coefficients.map(c => c[0]);
}

export const derivePolyAt = (coeff: number[], x: number): number => {
    let result = 0;
    for (let i = 1; i < coeff.length; i++) {
        result += i * coeff[i] * Math.pow(x, i - 1);
    }
    return result;
}

export const calcCentralDifferences = (dfData: Point[]): Point[] => {
    const n = dfData.length;
    const centralDifferences: number[] = new Array(n).fill(0);

    // Higher-order central difference formula for the interior points
    for (let i = 2; i < n - 2; i++) {
        const h = dfData[i + 1].x - dfData[i].x;  // Assuming uniform spacing
        centralDifferences[i] = (-dfData[i + 2].y + 8*dfData[i + 1].y - 8*dfData[i - 1].y + dfData[i - 2].y) / (12 * h);
    }

    // Polynomial fitting for boundary points
    const boundaryDegree = 4;  // Using a 4th degree polynomial for fitting
    const coeffsStart = fitPoly(dfData.slice(0, boundaryDegree + 1), boundaryDegree);
    const coeffsEnd = fitPoly(dfData.slice(-boundaryDegree - 1), boundaryDegree);

    centralDifferences[0] = derivePolyAt(coeffsStart, dfData[0].x);
    centralDifferences[1] = derivePolyAt(coeffsStart, dfData[1].x);
    centralDifferences[n-2] = derivePolyAt(coeffsEnd, dfData[n-2].x);
    centralDifferences[n-1] = derivePolyAt(coeffsEnd, dfData[n-1].x);

    return dfData.map((point, i) => ({ x: point.x, y: centralDifferences[i] }));
}


export const exponentiallyFitDfData = (dfData: Point[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const output: any = {}
    const xVals : number[] = dfData.map(point => {return point.x})
    const yVals: number[] = dfData.map(point =>  {return point.y});
    const centralDiffs: number[] = calcCentralDifferences(dfData).map(point => point.y);
    // Calculate integrals
    const iy1: number[] = cumtrapz(centralDiffs, xVals);
    const iy2: number[] = cumtrapz(iy1, xVals);
    const ones: number[] = new Array(iy1.length).fill(1);

    // Get exponential lambdas
    const Y = new Matrix(columnStack(iy1, iy2, xVals, ones))
    const pseudoInv = pseudoInverse(Y)
    const matrixCentralDiffs = new Matrix([centralDiffs]).transpose()
    const A = pseudoInv.mmul(matrixCentralDiffs)
    const eigArray = vstack([[A.get(0, 0), A.get(1, 0)]], [[1, 0]])
    const e = new EigenvalueDecomposition(eigArray)
    const lambdas = e.realEigenvalues

    // Get exponential multipliers
    const X = new Matrix(columnStack(
        xVals.map(x => {return math.exp(lambdas[0] * x)}),
        xVals.map(x => {return math.exp(lambdas[1] * x)})
    ))
    const P = pseudoInverse(X).mmul(matrixCentralDiffs)

    output.p0 = P.get(0, 0);
    output.p1 =  P.get(1, 0);
    output.lambda0 =  lambdas[0];
    output.lambda1 = lambdas[1]


     const dfFunc: curveFit.FunctionToOptimize = (x: number, c: number) => {
        return (output.p0/lambdas[0]) * math.exp(lambdas[0] * x) + (output.p1/lambdas[1]) * math.exp(lambdas[1] * x) + c;
     }
     const result = curveFit.curveFit(dfFunc, xVals, yVals, [5]);
     output.c = result.params[0]
     return output
}
