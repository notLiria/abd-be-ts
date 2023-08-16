import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  FilterBuilder,
  repository,
} from '@loopback/repository';
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
import {Samples} from '../models';
import {SamplesRepository} from '../repositories';
import {exponentiallyFitDfData} from '../utils/dfcRegression';
import {calcEnergyAtPoint, getLongbowPoint} from '../utils/energyCalcs';
import {stringifyDfcEqn} from '../utils/mathFunctions';

@authenticate('jwt')
export class SampleController {
  constructor(
    @repository(SamplesRepository)
    public samplesRepository: SamplesRepository,
  ) {}

  @post('/samples')
  @response(200, {
    description: 'Samples model instance',
    content: {'application/json': {schema: getModelSchemaRef(Samples)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Samples, {
            title: 'NewSamples',
            exclude: ['sampleId'],
          }),
        },
      },
    })
    sample: Omit<Samples, 'sampleId'>,
  ): Promise<Object> {
    const dfData = JSON.parse(sample.dfData)
    const expCoeffs = exponentiallyFitDfData(dfData);
    //const totalEnergy = calcTotalEnergy(expCoeffs, dfData)
    const partialEnergy = calcEnergyAtPoint(expCoeffs, dfData, 34)
    const longbowPoint = getLongbowPoint(dfData, expCoeffs);
    console.log(stringifyDfcEqn(expCoeffs))
    //console.log(totalEnergy);
    console.log(partialEnergy)
    console.log(longbowPoint)

    //return this.samplesRepository.create(samples);
    return {}
  }

  @authenticate.skip()
  @get('/samples/count')
  @response(200, {
    description: 'Samples model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.samplesRepository.count();
  }

  @authenticate.skip()
  @get('/samples/{id}')
  @response(200, {
    description: 'Samples model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Samples, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Samples> {
    return this.samplesRepository.findById(id);
  }

  @authenticate.skip()
  @get('/samples/bow-type/{bow_type_id}')
  @response(200, {
    description: 'Samples model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Samples, {includeRelations: true}),
      },
    },
  })
  async findByBowTypeId(
    @param.path.number('bow_type_id') bowTypeId: number,
  ): Promise<object> {
    const filterBuilder = new FilterBuilder();
    const bowTypeIdFilter = filterBuilder
      .fields('sampleId', 'bowTypeId', 'submodel', 'nominalPoundage')
      .where({bowTypeId})
      .build();
    return this.samplesRepository.find(bowTypeIdFilter);
  }

  @patch('/samples/{id}')
  @response(204, {
    description: 'Samples PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Samples, {partial: true}),
        },
      },
    })
    samples: Samples,
  ): Promise<void> {
    await this.samplesRepository.updateById(id, samples);
  }

  @del('/samples/{id}')
  @response(204, {
    description: 'Samples DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.samplesRepository.deleteById(id);
  }
}
