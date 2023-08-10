import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {BowTypes, BowTypesRelations} from '../models';

export class BowTypesRepository extends DefaultCrudRepository<
  BowTypes,
  typeof BowTypes.prototype.bowTypeId,
  BowTypesRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(BowTypes, dataSource);
  }
}
