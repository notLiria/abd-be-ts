import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'abd_be_pgsql',
  connector: 'postgresql',
  url: process.env.DATABASE_URL,
  host: '',
  user: '',
  password: '',
  database: 'abd_be_1',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AbdBePgsqlDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'abd_be_pgsql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.abd_be_pgsql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
