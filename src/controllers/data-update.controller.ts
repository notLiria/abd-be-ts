import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {DataUpdate} from '../models';
import {DataUpdateRepository} from '../repositories';

export class DataUpdateController {
  constructor(
    @repository(DataUpdateRepository)
    public dataUpdateRepository: DataUpdateRepository,
  ) {}

  async createUpdates(
    dataUpdate: Omit<DataUpdate, 'updateId'>[],
  ): Promise<Object> {
    const date = new Date();
    dataUpdate.forEach(update => {
      update.modificationDate = date.toISOString();
    });
    return this.dataUpdateRepository.createAll(dataUpdate);
  }

  @get('/data-updates')
  @response(200, {
    description: 'Array of DataUpdate model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DataUpdate, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DataUpdate) filter?: Filter<DataUpdate>,
  ): Promise<DataUpdate[]> {
    return this.dataUpdateRepository.find(filter);
  }
}
