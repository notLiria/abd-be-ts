// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/example-greeting-app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/core';
import {AutoTaggerService, CachingService} from './services/';

/**
 * Strongly-typed binding key for CachingService
 */
export const CACHING_SERVICE = BindingKey.create<CachingService>(
  'services.CachingService',
);

export const AUTOTAGGING_SERVICE = BindingKey.create<AutoTaggerService>(
  'services.AutoTaggerService'
)
