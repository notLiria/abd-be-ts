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
  put,
  requestBody,
  response,
} from '@loopback/rest';
import debugFactory from 'debug';
import {ArrowShaft} from '../models';
import {ArrowShaftRepository} from '../repositories';

const debug = debugFactory('arrowShaftController')
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

  @authenticate('jwt')
  @put('/arrow-shafts')
  @response(200, {
    description: 'ArrowShaft model instance',
    content: {'application/json': {schema: getModelSchemaRef(ArrowShaft)}},
  })
  async update(
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
    arrowShafts: Omit<ArrowShaft, 'shaft_id'>[],
  ): Promise<void>{//Promise<ArrowShaft[]> {
    for (const shaft of arrowShafts) {
      const existingShaft = await this.arrowShaftRepository.findOne({
        where: {manufacturer: shaft.manufacturer, model: shaft.model, spine: shaft.spine}
      })
      if (existingShaft) {
        await this.arrowShaftRepository.updateById(existingShaft.shaftId, shaft)
        debug(`Shaft already exists, updating`)
      }
      else {
        await this.arrowShaftRepository.create(shaft)
        debug(`Shaft does not exist, creating`)
      }
    }
  }
}
