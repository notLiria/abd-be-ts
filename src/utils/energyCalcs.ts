import * as math from 'mathjs';
import {DfcCoeffs, Point} from './types';

export const exponentialDfFunc = (x: number, coeffs: DfcCoeffs)  => {
  return (coeffs.p0/coeffs.lambda0) * math.exp(coeffs.lambda0 * x) + (coeffs.p1/coeffs.lambda1) * math.exp(coeffs.lambda1 * x) + coeffs.c
}

export const calcTotalEnergy = (coeffs: DfcCoeffs, dfData: Point[]) => {
    const energies = dfData.slice(0, -1).map((point, index) => {
        const Fi = exponentialDfFunc(point.x, coeffs);
        const Fi1 = exponentialDfFunc(dfData[index+1].x, coeffs);
        const deltaX = dfData[index+1].x - point.x;
        return (Fi + Fi1) / 2 * deltaX;
    });

    const totalEnergy = energies.reduce((acc, val) => acc + val, 0);

    return totalEnergy * 0.113;
}


export const calcEnergyUpToPoint = (coeffs: DfcCoeffs, dfData: Point[], dlToBelly: number) => {

  return 0
}
