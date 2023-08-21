import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {
  TorsionalStabilityData,
  TorsionalStabilityDataRelations,
} from '../models';

export class TorsionalStabilityDataRepository extends DefaultCrudRepository<
  TorsionalStabilityData,
  typeof TorsionalStabilityData.prototype.tsId,
  TorsionalStabilityDataRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(TorsionalStabilityData, dataSource);
  }
}
