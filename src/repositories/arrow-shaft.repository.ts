import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {ArrowShaft, ArrowShaftRelations} from '../models';

export class ArrowShaftRepository extends DefaultCrudRepository<
  ArrowShaft,
  typeof ArrowShaft.prototype.shaftId,
  ArrowShaftRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(ArrowShaft, dataSource);
  }
}
