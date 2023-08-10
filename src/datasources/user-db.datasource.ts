import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'UserDb',
  connector: 'memory',
  localStorage: '',
  file: './data/userDb.json',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class UserDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'UserDb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.UserDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
