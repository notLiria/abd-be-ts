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
import {ArrowShaft} from '../models';
import {ArrowShaftRepository} from '../repositories';

export class ArrowShaftController {
  constructor(
    @repository(ArrowShaftRepository)
    public arrowShaftRepository: ArrowShaftRepository,
  ) {}

  @authenticate('jwt')
  @post('/arrow-shafts')
  @response(200, {
    description: 'ArrowShaft model instance',
    content: {'application/json': {schema: getModelSchemaRef(ArrowShaft)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(ArrowShaft, {
              title: 'NewArrowShaft',
              exclude: ['shaftId'],
            }),
          },
        },
      },
    })
    arrowShaft: Omit<ArrowShaft, 'shaft_id'>[],
  ): Promise<ArrowShaft[]> {
    return this.arrowShaftRepository.createAll(arrowShaft);
  }

  @get('/arrow-shafts/count')
  @response(200, {
    description: 'ArrowShaft model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ArrowShaft) where?: Where<ArrowShaft>,
  ): Promise<Count> {
    return this.arrowShaftRepository.count(where);
  }

  @get('/arrow-shafts')
  @response(200, {
    description: 'Array of ArrowShaft model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ArrowShaft, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ArrowShaft) filter?: Filter<ArrowShaft>,
  ): Promise<ArrowShaft[]> {
    return this.arrowShaftRepository.find(filter);
  }
}
