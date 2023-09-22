import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'fps_data'},
  },
})
export class FpsData extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'fps_id',
      generated: true,
    },
  })
  fpsId?: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'sample_id',
      generated: true,
    },
  })
  sampleId: number;

  @property({
    type: 'number',
    required: true,
  })
  dl: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'arrow_weight',
      generated: true,
    },
  })
  arrowWeight: number;

  @property({
    type: 'number',
    required: true,
  })
  gpp: number;

  @property({
    type: 'number',
    required: true,
  })
  fps: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'measured_energy',
      generated: true,
    },
  })
  measuredEnergy: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'stored_energy',
      generated: true,
    },
  })
  storedEnergy: number;

  @property({
    type: 'number',
  })
  efficiency?: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'draw_length_to_belly',
      generated: true,
    },
  })
  drawLengthToBelly: number;

  constructor(data?: Partial<FpsData>) {
    super(data);
  }
}

export interface FpsDataRelations {
  // describe navigational properties here
}

export type FpsDataWithRelations = FpsData & FpsDataRelations;
