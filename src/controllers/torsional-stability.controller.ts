import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  FilterBuilder,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {TorsionalStabilityData} from '../models';
import {TorsionalStabilityDataRepository} from '../repositories';

@authenticate('jwt')
export class TorsionalStabilityController {
  constructor(
    @repository(TorsionalStabilityDataRepository)
    public torsionalStabilityDataRepository: TorsionalStabilityDataRepository,
  ) {}

  @post('/torsional-stability-data')
  @response(200, {
    description: 'TorsionalStabilityData model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(TorsionalStabilityData)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(TorsionalStabilityData, {
              title: 'NewTorsionalStabilityData',
              exclude: ['tsId'],
            }),
          },
        },
      },
    })
    torsionalStabilityData: Omit<TorsionalStabilityData, 'tsId'>[],
  ): Promise<TorsionalStabilityData[]> {
    return this.torsionalStabilityDataRepository.createAll(
      torsionalStabilityData,
    );
  }

  @authenticate.skip()
  @get('/torsional-stability-data/count')
  @response(200, {
    description: 'TorsionalStabilityData model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TorsionalStabilityData) where?: Where<TorsionalStabilityData>,
  ): Promise<Count> {
    return this.torsionalStabilityDataRepository.count(where);
  }

  @authenticate.skip()
  @get('/torsional-stability-data/{sample_id}')
  @response(200, {
    description: 'TorsionalStabilityData model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TorsionalStabilityData, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.number('sample_id') sampleId: number,
  ): Promise<object> {
    const filterBuilder = new FilterBuilder<TorsionalStabilityData>();
    const sampleIdFilter = filterBuilder
      .fields('sampleId', 'mass', 'deflection')
      .where({sampleId})
      .build();
    return this.torsionalStabilityDataRepository.find(sampleIdFilter);
  }
}
