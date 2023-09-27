import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {Count, CountSchema, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {BowTypes, DataUpdate} from '../models';
import {BowTypesRepository} from '../repositories';
import {DataUpdateController} from './data-update.controller';

export class BowTypesController {
  constructor(
    @inject('controllers.DataUpdateController')
    private dataUpdateController: DataUpdateController,

    @repository(BowTypesRepository)
    public bowTypesRepository: BowTypesRepository,
  ) {}

  @authenticate('jwt')
  @post('/bow-types')
  @response(200, {
    description: 'BowTypes model instance',
    content: {'application/json': {schema: getModelSchemaRef(BowTypes)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BowTypes, {
            title: 'NewBowTypes',
            exclude: ['bowTypeId'],
          }),
        },
      },
    })
    bowTypes: Omit<BowTypes, 'bowTypeId'>,
  ): Promise<BowTypes> {
    const recordCreationOutput = await this.bowTypesRepository.create(bowTypes);
    await this.dataUpdateController.createUpdates([
      new DataUpdate({bowTypeId: recordCreationOutput.bowTypeId}),
    ]);
    return recordCreationOutput;
  }

  @get('/bow-types/count')
  @response(200, {
    description: 'BowTypes model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.bowTypesRepository.count();
  }

  @get('/bow-types')
  @response(200, {
    description: 'Array of all BowTypes model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(BowTypes, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Object[]> {
    return this.bowTypesRepository.find();
  }

  @get('/bow-types/{id}')
  @response(200, {
    description: 'Array of all BowTypes model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(BowTypes, {includeRelations: true}),
        },
      },
    },
  })
  async findById(@param.path.number('id') bowTypeId: number): Promise<Object> {
    const data = await this.bowTypesRepository.findById(bowTypeId);
    return data;
  }

  @authenticate('jwt')
  @patch('/bow-types/{id}')
  @response(204, {
    description: 'BowTypes PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BowTypes, {partial: true}),
        },
      },
    })
    bowTypes: BowTypes,
  ): Promise<void> {
    await this.bowTypesRepository.updateById(id, bowTypes);
  }
}
