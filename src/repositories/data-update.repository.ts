import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {DataUpdate, DataUpdateRelations} from '../models';

export class DataUpdateRepository extends DefaultCrudRepository<
  DataUpdate,
  typeof DataUpdate.prototype.updateId,
  DataUpdateRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(DataUpdate, dataSource);
  }
}
