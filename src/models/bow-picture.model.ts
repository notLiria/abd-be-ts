import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {
      schema: 'public',
      table: 'bow_pictures',
    },
  },
})
export class BowPicture extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'picture_id',
    },
  })
  pictureId?: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'picture_link',
    },
  })
  pictureLink: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'bow_type_id',
    },
  })
  bowTypeId: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'sample_id',
    },
  })
  sampleId: number;

  @property({
    type: 'string',
  })
  caption?: string;

  constructor(data?: Partial<BowPicture>) {
    super(data);
  }
}

export interface BowPictureRelations {
  // describe navigational properties here
}

export type BowPictureWithRelations = BowPicture & BowPictureRelations;
