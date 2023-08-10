import {Entity, model, property} from '@loopback/repository';

@model({
    settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'bow_type_tags'},
  },
})
export class BowTypeTags extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
    postgresql: {
      columnName: 'tag_id'
    }
  })
  tagId: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: "bow_type_id"
    }
  })
  bowTypeId: number;


  constructor(data?: Partial<BowTypeTags>) {
    super(data);
  }
}

export interface BowTypeTagsRelations {
  // describe navigational properties here
}

export type BowTypeTagsWithRelations = BowTypeTags & BowTypeTagsRelations;
