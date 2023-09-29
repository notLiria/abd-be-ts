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
import md5 from 'md5';
import {CACHING_SERVICE} from '../keys';
import {CachingService} from '../services/caching.service';

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
      if (!httpReq || httpReq.method === 'POST') {
        // Not http request
        return next();
      }

      const key = httpReq.path;
      const query = md5(JSON.stringify(httpReq.query));
      const cachingKey = `${key}:${query}`;
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
