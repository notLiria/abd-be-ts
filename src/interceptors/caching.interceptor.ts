import {
  asGlobalInterceptor,
  inject,
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {RestBindings} from '@loopback/rest';
import debugFactory from 'debug';
import {CachingService} from '../caching-service';
import {CACHING_SERVICE} from '../keys';

const debug = debugFactory('caching');

@injectable(asGlobalInterceptor('caching'))
export class CachingInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(CACHING_SERVICE) private cachingService: CachingService,
  ) {}

  value() {
    return async (
      ctx: InvocationContext,
      next: () => ValueOrPromise<InvocationResult>,
    ) => {
      const httpReq = await ctx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });
      /* istanbul ignore if */
      if (!httpReq) {
        // Not http request
        return next();
      }

      const key = httpReq.path;
      const cachingKey = `${key}`;
      const cachedResult = await this.cachingService.get(cachingKey);
      if (cachedResult && key !== '/cache/clear') {
        debug('Cache found for %s %j', cachingKey, cachedResult);
        return cachedResult;
      }
      const result = await next();
      await this.cachingService.set(cachingKey, result);
      return result;
    };
  }
}
