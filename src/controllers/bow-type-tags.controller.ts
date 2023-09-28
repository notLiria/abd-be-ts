import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  FilterBuilder,
  WhereBuilder,
  repository,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {BowTypeTags} from '../models';
import {BowTypeTagsRepository} from '../repositories';

@authenticate('jwt')
export class BowTypeTagsController {
  constructor(
    @repository(BowTypeTagsRepository)
    public bowTypeTagsRepository: BowTypeTagsRepository,
  ) {}

  @post('/bow-type-tags')
  @response(200, {
    description: 'BowTypeTags model instance',
    content: {'application/json': {schema: getModelSchemaRef(BowTypeTags)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BowTypeTags, {
            title: 'NewBowTypeTags',
          }),
        },
      },
    })
    bowTypeTags: BowTypeTags,
  ): Promise<BowTypeTags> {
    return this.bowTypeTagsRepository.create(bowTypeTags);
  }

  @authenticate.skip()
  @get('/bow-type-tags/count')
  @response(200, {
    description: 'BowTypeTags model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.bowTypeTagsRepository.count();
  }

  @authenticate.skip()
  @get('/bow-type-tags/tag/{tag_id}')
  @response(200, {
    description: 'BowTypeTags model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BowTypeTags, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('tag_id') tagId: number): Promise<object> {
    const filterBuilder = new FilterBuilder<BowTypeTags>();
    const tagIdFilter = filterBuilder
      .fields('tagId', 'bowTypeId')
      .where({tagId})
      .build();
    return this.bowTypeTagsRepository.find(tagIdFilter);
  }

  @authenticate.skip()
  @get('/bow-type-tags/bow-type/{bow_type_id}')
  @response(200, {
    description: 'BowTypeTags model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BowTypeTags, {includeRelations: true}),
      },
    },
  })
  async findByBowTypeId(
    @param.path.number('bow_type_id') bowTypeId: number,
  ): Promise<object> {
    const filterBuilder = new FilterBuilder<BowTypeTags>();
    const bowTypeIdFilter = filterBuilder
      .fields('tagId', 'bowTypeId')
      .where({bowTypeId})
      .build();
    return this.bowTypeTagsRepository.find(bowTypeIdFilter);
  }

  @authenticate.skip()
  @get('/bow-type-tags')
  @response(200, {
    description: 'All bow type tags',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BowTypeTags),
      },
    },
  })
  async getAllBowTypeTags(): Promise<BowTypeTags[]> {
    return this.bowTypeTagsRepository.find();
  }

  @del('/bow-type-tags/')
  @response(204, {
    description: 'BowTypeTags DELETE success',
  })
  async deleteById(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BowTypeTags, {
            title: 'BowTypeTag',
          }),
        },
      },
    })
    bowTypeTag: BowTypeTags,
  ): Promise<object> {
    const whereBuilder = new WhereBuilder<BowTypeTags>();
    const whereFilter = whereBuilder
      .and({bowTypeId: bowTypeTag.bowTypeId}, {tagId: bowTypeTag.tagId})
      .build();
    return this.bowTypeTagsRepository.deleteAll(whereFilter);
  }
}
