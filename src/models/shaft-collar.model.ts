import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {
      schema: 'public',
      table: 'shaft_collars',
    },
  },
})
export class ShaftCollar extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'collar_id',
    },
  })
  collarId?: number;

  @property({
    type: 'string',
    required: true,
  })
  manufacturer: string;

  @property({
    type: 'string',
    required: true,
  })
  model: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'shaft_size',
    },
  })
  shaftSize?: string;

  @property({
    type: 'number',
    default: -1,
    postgresql: {
      columnName: 'outsert_id',
    },
  })
  outsertId?: string;

  @property({
    type: 'number',
    default: -1,
    postgresql: {
      columnName: 'outsert_od',
    },
  })
  outsertOd?: number;

  @property({
    type: 'number',
    default: -1,
    postgresql: {
      columnName: 'point_size',
    },
  })
  pointSize?: number;

  @property({
    type: 'number',
    default: -1,
  })
  weight?: number;

  constructor(data?: Partial<ShaftCollar>) {
    super(data);
  }
}

export interface ShaftCollarRelations {
  // describe navigational properties here
}

export type ShaftCollarWithRelations = ShaftCollar & ShaftCollarRelations;
