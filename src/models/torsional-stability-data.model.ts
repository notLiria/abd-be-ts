import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'torsional_stability_data'},
  },
})
export class TorsionalStabilityData extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'ts_id',
      generated: true,
    },
  })
  tsId?: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'sample_id',
    },
  })
  sampleId: number;

  @property({
    type: 'number',
    required: true,
  })
  mass: number;

  @property({
    type: 'number',
    required: true,
  })
  deflection: number;

  constructor(data?: Partial<TorsionalStabilityData>) {
    super(data);
  }
}

export interface TorsionalStabilityDataRelations {
  // describe navigational properties here
}

export type TorsionalStabilityDataWithRelations = TorsionalStabilityData &
  TorsionalStabilityDataRelations;
