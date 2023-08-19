import {columnStack, cumtrapz, vstack} from './mathFunctions';

describe('cumtrapz', () => {
  it('should compute the cumulative integral of a constant function', () => {
    const y = [2, 2, 2, 2, 2];
    const x = [0, 1, 2, 3, 4];
    const result = cumtrapz(y, x);
    expect(result).toEqual([0, 2, 4, 6, 8]);
  });

  it('should compute the cumulative integral of a linear function', () => {
    const y = [0, 1, 2, 3, 4];
    const x = [0, 1, 2, 3, 4];
    const result = cumtrapz(y, x);
    expect(result).toEqual([0, 0.5, 2, 4.5, 8]);
  });

  it('should handle uneven x spacing', () => {
    const y = [0, 2, 4];
    const x = [0, 1, 4];
    const result = cumtrapz(y, x);
    expect(result).toEqual([0, 1, 10]);
  });

  it('should throw an error if y and x arrays have different lengths', () => {
    const y = [1, 2, 3];
    const x = [0, 1];
    expect(() => cumtrapz(y, x)).toThrow(
      'Input arrays y and x must have the same length.',
    );
  });

  it('should compute the cumulative integral of a function with negative values', () => {
    const y = [-2, -2, -2, -2, -2];
    const x = [0, 1, 2, 3, 4];
    const result = cumtrapz(y, x);
    expect(result).toEqual([0, -2, -4, -6, -8]);
  });
});

describe('columnStack', () => {
  it('should throw an error if no arrays are provided', () => {
    expect(() => {
      columnStack();
    }).toThrow('At least one array must be provided.');
  });

  it('should throw an error if arrays of different lengths are provided', () => {
    expect(() => {
      columnStack([1, 2], [3, 4, 5]);
    }).toThrow('All input arrays must have the same length.');
  });

  it('should return a stacked array for given input arrays', () => {
    const result = columnStack([1, 2], [3, 4], [5, 6]);
    expect(result).toEqual([
      [1, 3, 5],
      [2, 4, 6],
    ]);
  });

  it('should handle single arrays', () => {
    const result = columnStack([1, 2]);
    expect(result).toEqual([[1], [2]]);
  });

  it('should handle arrays with multiple elements', () => {
    const result = columnStack([1, 2, 3], [4, 5, 6], [7, 8, 9]);
    expect(result).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
  });
});

describe('vstack', () => {
  it('should throw an error if arrays with rows of different lengths are provided', () => {
    expect(() => {
      vstack(
        [
          [1, 2],
          [3, 4],
        ],
        [[5, 6, 7]],
      );
    }).toThrow('All input arrays must have rows of the same length.');
  });

  it('should return a vertically stacked array for given input arrays', () => {
    const result = vstack(
      [
        [1, 2],
        [3, 4],
      ],
      [
        [5, 6],
        [7, 8],
      ],
    );
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ]);
  });

  it('should handle single input arrays', () => {
    const result = vstack([[1, 2]]);
    expect(result).toEqual([[1, 2]]);
  });

  it('should handle arrays with multiple rows and columns', () => {
    const result = vstack(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      [
        [7, 8, 9],
        [10, 11, 12],
      ],
    );
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
    ]);
  });

  it('should concatenate multiple arrays', () => {
    const result = vstack([[1, 2]], [[3, 4]], [[5, 6]]);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });
});
