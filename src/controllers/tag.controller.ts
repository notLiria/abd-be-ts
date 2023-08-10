import {authenticate} from '@loopback/authentication';
import {Count, CountSchema, repository, Where} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Tags} from '../models';
import {TagsRepository} from '../repositories';

export class TagController {
  constructor(
    @repository(TagsRepository)
    public tagsRepository: TagsRepository,
  ) {}

  @authenticate('jwt')
  @post('/tags')
  @response(200, {
    description: 'Tags model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tags)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tags, {
            title: 'NewTags',
            exclude: ['tagId'],
          }),
        },
      },
    })
    tags: Omit<Tags, 'tagId'>,
  ): Promise<Tags> {
    return this.tagsRepository.create(tags);
  }

  @get('/tags/count')
  @response(200, {
    description: 'Tags model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Tags) where?: Where<Tags>): Promise<Count> {
    return this.tagsRepository.count(where);
  }

  @get('/tags')
  @response(200, {
    description: 'Array of Tags model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tags, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Tags[]> {
    return this.tagsRepository.find();
  }

  @get('/tags/{id}')
  @response(200, {
    description: 'Tags model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tags, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Tags> {
    return this.tagsRepository.findById(id);
  }

  @authenticate('jwt')
  @patch('/tags/{id}')
  @response(204, {
    description: 'Tags PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tags, {partial: true}),
        },
      },
    })
    tags: Tags,
  ): Promise<void> {
    await this.tagsRepository.updateById(id, tags);
  }

  @authenticate('jwt')
  @del('/tags/{id}')
  @response(204, {
    description: 'Tags DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tagsRepository.deleteById(id);
  }
}
