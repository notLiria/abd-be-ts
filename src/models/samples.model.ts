import {Entity, model, property} from '@loopback/repository';
@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'samples'},
  },
})
export class Samples extends Entity {
  @property({
    type: 'number',
    required: true,
    id: true,
    postgresql: {
      columnName: 'sample_id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
      generated: true,
    },
  })
  sampleId: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'bow_type_id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
    },
  })
  bowTypeId: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'unstrung_length',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  unstrungLength?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'strung_length',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  strungLength?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'min_box_length',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  minBoxLength?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'min_box_width',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  minBoxWidth?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'min_box_depth',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  minBoxDepth?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'siyah_effective_top_length',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  siyahEffectiveTopLength?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'siyah_effective_bottom_length',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  siyahEffectiveBottomLength?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'siyah_effective_top_angle',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  siyahEffectiveTopAngle?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'siyah_effective_bottom_angle',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  siyahEffectiveBottomAngle?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'bow_mass',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'YES',
      generated: undefined,
    },
  })
  bowMass?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'grip_length',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  gripLength?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'grip_width',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  gripWidth?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'grip_depth',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  gripDepth?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'max_limb_thickness',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  maxLimbThickness?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'min_limb_thickness',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  minLimbThickness?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'max_limb_width',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  maxLimbWidth?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'min_limb_width',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  minLimbWidth?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'arrow_pass_width',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  arrowPassWidth?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'max_draw',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'YES',
      generated: undefined,
    },
  })
  maxDraw?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'stock_string_length_min',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  stockStringLengthMin?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'stock_string_length_max',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  stockStringLengthMax?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'brace_height',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  braceHeight?: number;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'contributor_contact_type',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  contributorContactType?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'contributor_contact_info',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  contributorContactInfo?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'manufacture_date',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  manufactureDate?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'measurement_date',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  measurementDate?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'comments',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  comments?: string;

  @property({
    type: 'boolean',
    postgresql: {
      columnName: 'asym',
      dataType: 'boolean',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  asym?: boolean;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'asym_length_top',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  asymLengthTop?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'asym_length_bottom',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  asymLengthBottom?: number;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'df_data',
      dataType: 'path',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
      generated: undefined,
    },
  })
  dfData: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'df_data_text',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  dfDataText?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'central_differences',
      dataType: 'path',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  centralDifferences?: string;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'longbow_point',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'YES',
      generated: undefined,
    },
  })
  longbowPoint?: number;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'stored_energy',
      dataType: 'ARRAY',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  storedEnergy?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'regression_curve',
      dataType: 'path',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  regressionCurve?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'coeffs',
      dataType: 'ARRAY',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  coeffs?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'regression_eqn',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  regressionEqn?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'regression_derivative',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  regressionDerivative?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'regression_derivative_values',
      dataType: 'path',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  regressionDerivativeValues?: string;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'hysteresis',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  hysteresis?: number;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'virtual_mass',
      dataType: 'float',
      dataLength: null,
      dataPrecision: 53,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  virtualMass?: number;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'submodel',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  submodel?: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'nominal_poundage',
      dataType: 'text',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
      generated: undefined,
    },
  })
  nominalPoundage?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Samples>) {
    super(data);
  }
}

export interface SamplesRelations {
  // describe navigational properties here
}

export type SamplesWithRelations = Samples & SamplesRelations;
