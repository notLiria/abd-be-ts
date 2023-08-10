import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'tags'}},
})
export class Tags extends Entity {
  @property({
    type: 'number',
    id: true,
    postgresql: {
      columnName: 'tag_id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
      generated: true,
    },
  })
  tagId: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'tag_name',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  tagName: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'tag_description',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  tagDescription?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Tags>) {
    super(data);
  }
}

export interface TagsRelations {
  // describe navigational properties here
}

export type TagsWithRelations = Tags & TagsRelations;
