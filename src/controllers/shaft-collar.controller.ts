import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
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
import {ShaftCollar} from '../models';
import {ShaftCollarRepository} from '../repositories';

export class ShaftCollarController {
  constructor(
    @repository(ShaftCollarRepository)
    public shaftCollarRepository: ShaftCollarRepository,
  ) {}

  @authenticate('jwt')
  @post('/shaft-collars')
  @response(200, {
    description: 'ShaftCollar model instance',
    content: {'application/json': {schema: getModelSchemaRef(ShaftCollar)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(ShaftCollar, {
              title: 'NewShaftCollar',
              exclude: ['collarId'],
            }),
          },
        },
      },
    })
    shaftCollar: Omit<ShaftCollar, 'collarId'>[],
  ): Promise<ShaftCollar[]> {
    return this.shaftCollarRepository.createAll(shaftCollar);
  }

  @get('/shaft-collars/count')
  @response(200, {
    description: 'ShaftCollar model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ShaftCollar) where?: Where<ShaftCollar>,
  ): Promise<Count> {
    return this.shaftCollarRepository.count(where);
  }

  @get('/shaft-collars')
  @response(200, {
    description: 'Array of ShaftCollar model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ShaftCollar, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ShaftCollar) filter?: Filter<ShaftCollar>,
  ): Promise<ShaftCollar[]> {
    return this.shaftCollarRepository.find(filter);
  }
}
