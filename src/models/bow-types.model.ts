import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'bow_types'},
  },
})
export class BowTypes extends Entity {
  @property({
    type: 'number',
    id: true,
    postgresql: {
      columnName: 'bow_type_id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
      generated: true,
    },
  })
  bowTypeId: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'model_name',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  modelName: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'manufacturer',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  manufacturer?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'bow_link',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  bowLink?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BowTypes>) {
    super(data);
  }
}

export interface BowTypesRelations {
  // describe navigational properties here
}

export type BowTypesWithRelations = BowTypes & BowTypesRelations;
