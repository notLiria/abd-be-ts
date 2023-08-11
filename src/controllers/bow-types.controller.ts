import {authenticate} from '@loopback/authentication';
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
import {BowTypes} from '../models';
import {BowTypesRepository} from '../repositories';

export class BowTypesController {
  constructor(
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
  ): Promise<object> {
    return this.bowTypesRepository.create(bowTypes);
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
    const data = await this.bowTypesRepository.find();
    return data.map(item => this.transformOutput(item));
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

  transformOutput(item: BowTypes): object {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      bow_type_id: item.bowTypeId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      model_name: item.modelName,
      manufacturer: item.manufacturer,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      bow_link: item.bowLink,
    };
  }
}
