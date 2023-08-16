import * as math from 'mathjs';
import {cumtrapz, linspace} from './mathFunctions';
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


export const calcEnergyAtPoint = (coeffs: DfcCoeffs, dfData: Point[], dlToBelly: number) => {
  const minX = Math.min(...dfData.map(point => point.x))
  const xVals = linspace(minX, dlToBelly, 100)

  const yVals = xVals.map(xVal => {return exponentialDfFunc(xVal, coeffs)})

  const energy = cumtrapz(yVals, xVals);


  return energy[energy.length - 1] * 0.113
}


export const getLongbowPoint = (dfData: Point[], regressionCoeffs: DfcCoeffs): number | null => {

    const minX = Math.min(...dfData.map(point => point.x));
    const maxX = Math.max(...dfData.map(point => point.x));

    const calcLineAreaAtPoint = (point: Point) => {
      // Calculate slope
      const p0 = {x: dfData[0].x, y: exponentialDfFunc(dfData[0].x, regressionCoeffs)}
      const slope =  1 * (point.y - p0.y)/(point.x - p0.x)
      const b = point.y - slope * point.x

      // Create a linspace
      const xVals = linspace(p0.x, point.x, 100)
      const yVals = xVals.map(xVal => {return slope * xVal + b})
      // Use trapz

      const areas = cumtrapz(yVals, xVals)

      // Return 0.113 the last val
      return areas[areas.length - 1] * 0.113
    }


    const step = 0.1; // Increment by 0.1, can adjust for precision
    const xValues = Array.from({ length: Math.ceil((maxX - minX) / step) }, (_, idx) => minX + idx * step);

    const longbowPoints = xValues.map((pointCandidate: number) => {
        const lineEndPoint: Point = { x: pointCandidate, y: exponentialDfFunc(pointCandidate, regressionCoeffs)};

        const areaUnderExpCurve = calcEnergyAtPoint(regressionCoeffs, dfData, pointCandidate);

        const areaUnderLine = calcLineAreaAtPoint(lineEndPoint)//  0.5 * (dfData[0].y + lineEndPoint.y) * (lineEndPoint.x - dfData[0].x) * 0.113;


        return { x: pointCandidate, areaUnderExpCurve, areaUnderLine , lineEndPoint};
    })//.find(point => point.areaUnderExpCurve < point.areaUnderLine);

    const longbowPoint = longbowPoints.filter(el => {
      return el.areaUnderExpCurve < el.areaUnderLine
    });


    return longbowPoint.length > 0 ? longbowPoint[0].x : -1
}
