import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AbdBePgsqlDataSource} from '../datasources';
import {BowPicture, BowPictureRelations} from '../models';

export class BowPictureRepository extends DefaultCrudRepository<
  BowPicture,
  typeof BowPicture.prototype.pictureId,
  BowPictureRelations
> {
  constructor(
    @inject('datasources.abd_be_pgsql') dataSource: AbdBePgsqlDataSource,
  ) {
    super(BowPicture, dataSource);
  }
}
