import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
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
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {DataUpdate, FpsData} from '../models';
import {FpsDataRepository} from '../repositories';
import {DataUpdateController} from './data-update.controller';

export class FpsDataController {
  constructor(
    @inject('controllers.DataUpdateController')
    private dataUpdateController: DataUpdateController,
    @repository(FpsDataRepository)
    public fpsDataRepository: FpsDataRepository,
  ) {}

  @authenticate('jwt')
  @post('/fps-data')
  @response(200, {
    description: 'FpsData model instance',
    content: {'application/json': {schema: getModelSchemaRef(FpsData)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(FpsData, {
              title: 'NewFpsData',
              exclude: ['fpsId'],
            }),
          },
        },
      },
    })
    fpsData: Omit<FpsData, 'fps_id'>[],
  ): Promise<FpsData[]> {
    const fpsDataResult = await this.fpsDataRepository.createAll(fpsData);

    await this.dataUpdateController.createUpdates(
      fpsDataResult.map(fpsPoint => {
        return new DataUpdate({fpsId: fpsPoint.fpsId});
      }),
    );

    return fpsDataResult;
  }

  @get('/fps-data/count')
  @response(200, {
    description: 'FpsData Point count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(FpsData) where?: Where<FpsData>): Promise<Count> {
    return this.fpsDataRepository.count(where);
  }

  @get('/fps-data/{sample_id}')
  @response(200, {
    description: 'Array of FpsData model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FpsData, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.number('sample_id') sampleId: number,
  ): Promise<FpsData[]> {
    const filterBuilder = new FilterBuilder<FpsData>();
    const sampleIdFilter = filterBuilder.where({sampleId}).build();
    return this.fpsDataRepository.find(sampleIdFilter);
  }

  @authenticate('jwt')
  @put('/fps-data')
  @response(200, {
    description: 'FPS Data model instance',
    content: {'application/json': {schema: getModelSchemaRef(FpsData)}},
  })
  async update(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(FpsData, {
              title: 'NewFpsData',
              exclude: ['fpsId'],
            }),
          },
        },
      },
    })
    fpsPoints: Omit<FpsData, 'fps_id'>[],
  ): Promise<FpsData[]>{//Promise<ArrowShaft[]> {
    console.log(fpsPoints)
    return this.fpsDataRepository.createAll(fpsPoints)
  }
}
