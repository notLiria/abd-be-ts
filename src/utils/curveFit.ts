export type FunctionToOptimize = (x: number, ...params: number[]) => number;

export interface OptimizationResult {
  params: number[];
  success: boolean;
  message: string;
}

export const curveFit = (
  func: FunctionToOptimize,
  xVals: number[],
  yVals: number[],
  initialParams: number[],
  learningRate = 0.01,
  maxIterations = 1000,
  tolerance = 1e-6,
): OptimizationResult => {
  const params = initialParams.slice();
  let prevError = Infinity;

  for (let iter = 0; iter < maxIterations; iter++) {
    let totalError = 0;
    const gradients = new Array(params.length).fill(0);

    for (let i = 0; i < xVals.length; i++) {
      const error = yVals[i] - func(xVals[i], ...params);
      totalError += error * error;

      // Calculate the gradient for each parameter
      for (let j = 0; j < params.length; j++) {
        const tweakedParams = params.slice();
        tweakedParams[j] += tolerance;
        const tweakedResult = func(xVals[i], ...tweakedParams);
        const derivative =
          (tweakedResult - func(xVals[i], ...params)) / tolerance;
        gradients[j] += error * derivative;
      }
    }

    if (Math.abs(prevError - totalError) < tolerance) {
      return {
        params: params,
        success: true,
        message: 'Convergence achieved',
      };
    }

    for (let j = 0; j < params.length; j++) {
      params[j] += learningRate * gradients[j];
    }

    prevError = totalError;
  }

  return {
    params: params,
    success: false,
    message: 'Maximum iterations reached',
  };
};
