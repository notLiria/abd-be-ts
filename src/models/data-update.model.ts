import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {
      schema: 'public',
      table: 'data_updates',
    },
  },
})
export class DataUpdate extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'update_id',
    },
  })
  updateId?: number;

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
    postgresql: {
      columnName: 'sample_id',
    },
  })
  sampleId?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'fps_id',
    },
  })
  fpsId?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'fps_regression_id',
    },
  })
  fpsRegressionId?: number;

  @property({
    type: 'date',
    generated: true,
    postgresql: {
      columnName: 'modification_date',
    },
  })
  modificationDate: string;

  @property({
    type: 'number',
    required: false,
    postgresql: {
      columnName: 'picture_id',
    },
  })
  pictureId: number;

  constructor(data?: Partial<DataUpdate>) {
    super(data);
  }
}

export interface DataUpdateRelations {
  // describe navigational properties here
}

export type DataUpdateWithRelations = DataUpdate & DataUpdateRelations;
