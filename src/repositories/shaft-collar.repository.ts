import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {ShaftCollar, ShaftCollarRelations} from '../models';

export class ShaftCollarRepository extends DefaultCrudRepository<
  ShaftCollar,
  typeof ShaftCollar.prototype.collarId,
  ShaftCollarRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(ShaftCollar, dataSource);
  }
}
