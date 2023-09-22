import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {FpsData, FpsDataRelations} from '../models';

export class FpsDataRepository extends DefaultCrudRepository<
  FpsData,
  typeof FpsData.prototype.fpsId,
  FpsDataRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(FpsData, dataSource);
  }
}
