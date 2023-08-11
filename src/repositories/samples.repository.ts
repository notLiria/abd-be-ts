import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {Samples, SamplesRelations} from '../models';

export class SamplesRepository extends DefaultCrudRepository<
  Samples,
  typeof Samples.prototype.sampleId,
  SamplesRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(Samples, dataSource);
  }
}
