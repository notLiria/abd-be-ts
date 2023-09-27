// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {inject} from '@loopback/context';
import {post, response} from '@loopback/rest';

import {authenticate} from '@loopback/authentication';
import {CachingService} from '../services/caching.service';

export class CacheController {
  constructor(
    @inject('services.CachingService')
    private cachingService: CachingService,
  ) {}

  @authenticate('jwt')
  @post('/cache/clear')
  @response(200, {
    description: 'Force clear cache',
  })
  async create(): Promise<Object> {
    await this.cachingService.clear();
    return {message: 'Successfully cleared cache'};
  }
}
