import {
  asGlobalInterceptor,
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {captureException, init} from '@sentry/node';

@injectable(asGlobalInterceptor('sentry'))
export class SentryInterceptor implements Provider<Interceptor> {
  constructor() {
    init({dsn: process.env.SENTRY_DSN});
  }

  value() {
    return async (
      ctx: InvocationContext,
      next: () => ValueOrPromise<InvocationResult>,
    ) => {
      try {
        const result = await next();
        return result;
      } catch (e) {
        captureException(e);
      }
    };
  }
}
