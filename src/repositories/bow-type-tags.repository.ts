import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {BowTypeTags, BowTypeTagsRelations} from '../models';

export class BowTypeTagsRepository extends DefaultCrudRepository<
  BowTypeTags,
  typeof BowTypeTags.prototype.tagId,
  BowTypeTagsRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(BowTypeTags, dataSource);
  }
}
