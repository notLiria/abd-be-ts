import {Entity, model, property} from '@loopback/repository';

@model()
export class ArrowShaft extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'shaft_id',
    },
  })
  shaftId?: number;

  @property({
    type: 'string',
    required: true,
  })
  manufacturer: string;

  @property({
    type: 'string',
    required: true,
  })
  model?: string;

  @property({
    type: 'number',
    required: true,
  })
  spine: number;

  @property({
    type: 'number',
  })
  gpi: number;

  @property({
    type: 'number',
  })
  od: number;
  @property({
    type: 'number',
  })
  id: number;
  @property({
    type: 'number',
    postgresql: {
      columnName: 'stock_length',
    },
  })
  stockLength: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'insert_stem_length',
    },
  })
  insertStemLength: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'insert_rim_length',
    },
  })
  insertRim: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'bushing_nock_inner_length',
    },
  })
  bushingNockInnerLength: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'bushing_outer_length',
    },
  })
  bushingOuterLength: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'insert_weight',
    },
  })
  insertWeight: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'bushing_nock_weight',
    },
  })
  bushingNockWeight: number;

  @property({
    type: 'string',
  })
  comments: string;

  constructor(data?: Partial<ArrowShaft>) {
    super(data);
  }
}

export interface ArrowShaftRelations {
  // describe navigational properties here
}

export type ArrowShaftWithRelations = ArrowShaft & ArrowShaftRelations;
