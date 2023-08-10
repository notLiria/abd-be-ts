import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {Tags, TagsRelations} from '../models';

export class TagsRepository extends DefaultCrudRepository<
  Tags,
  typeof Tags.prototype.tagId,
  TagsRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(Tags, dataSource);
  }
}
