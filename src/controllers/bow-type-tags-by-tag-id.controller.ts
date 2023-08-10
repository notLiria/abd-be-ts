import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  FilterBuilder,
  repository,
  WhereBuilder,
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
export class BowTypeTagsByTagIdController {
  constructor(
    @repository(BowTypeTagsRepository)
    public bowTypeTagsRepository: BowTypeTagsRepository,
  ) {}

  @post('/bow-type-tags-by-tag-id')
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
  @get('/bow-type-tags-by-tag-id/count')
  @response(200, {
    description: 'BowTypeTags model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.bowTypeTagsRepository.count();
  }

  @authenticate.skip()
  @get('/bow-type-tags-by-tag-id/{tag_id}')
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

  @del('/bow-type-tags-by-tag-id/{tag_id}/{bow_type_id}')
  @response(204, {
    description: 'BowTypeTags DELETE success',
  })
  async deleteById(
    @param.path.number('tag_id') tagId: number,
    @param.path.number('bow_type_id') bowTypeId: number,
  ): Promise<void> {
    const whereBuilder = new WhereBuilder<BowTypeTags>();
    const whereFilter = whereBuilder
      .and({bowTypeId: bowTypeId}, {tagId: tagId})
      .build();
    await this.bowTypeTagsRepository.deleteAll(whereFilter);
  }
}
