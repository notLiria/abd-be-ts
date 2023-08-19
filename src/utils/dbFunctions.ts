import {Point} from './types';

export const dfPairsToPath = (dfData: Point[]) => {
  return dfData
    .map((point: Point) => {
      return `(${point.x},${point.y})`;
    })
    .join(',');
};
