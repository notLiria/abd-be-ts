/* eslint-disable @typescript-eslint/no-explicit-any */

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
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

import {DataUpdate, Samples} from '../models';
import {SamplesRepository} from '../repositories';
import {dfPairsToPath} from '../utils/dbFunctions';
import {
  calcCentralDifferences,
  calcDerivative,
  calcRegressionCurve,
  exponentiallyFitDfData,
} from '../utils/dfcRegression';
import {getLongbowPoint} from '../utils/energyCalcs';
import {
  stringifyDfcDerivativeEqn,
  stringifyDfcEqn,
} from '../utils/mathFunctions';

import {AutoTaggerService} from '../services';
import {BowTypeTagsController} from './bow-type-tags.controller';
import {BowTypesController} from './bow-types.controller';
import {DataUpdateController} from './data-update.controller';
import {TagController} from './tag.controller';

@authenticate('jwt')
export class SampleController {
  constructor(
    @inject('services.AutoTaggerService')
    private autoTaggerService: AutoTaggerService,
    @inject('controllers.DataUpdateController')
    private dataUpdateController: DataUpdateController,
    @inject('controllers.BowTypeTagsController')
    private bowTypeTagsController: BowTypeTagsController,
    @inject('controllers.TagController')
    private tagsController: TagController,
    @inject('controllers.BowTypesController')
    private bowTypesController: BowTypesController,
    @repository(SamplesRepository)
    public samplesRepository: SamplesRepository,
  ) {}

  async find(filter: Filter<Samples>): Promise<Samples[]> {
    return this.samplesRepository.find(filter);
  }

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
    userSample: Omit<Samples, 'sampleId'>,
  ): Promise<Object> {
    const newSample: Omit<Samples, 'sampleId'> = {
      ...userSample,
    };
    const dfData = JSON.parse(userSample.dfData);
    const expCoeffs = exponentiallyFitDfData(dfData);

    newSample.centralDifferences = dfPairsToPath(
      calcCentralDifferences(dfData),
    );
    newSample.longbowPoint = getLongbowPoint(dfData, expCoeffs);
    newSample.regressionCurve = dfPairsToPath(
      calcRegressionCurve(dfData, expCoeffs),
    );

    newSample.regressionEqn = stringifyDfcEqn(expCoeffs);
    newSample.regressionDerivative = stringifyDfcDerivativeEqn(expCoeffs);
    newSample.regressionDerivativeValues = dfPairsToPath(
      calcDerivative(dfData, expCoeffs),
    );
    newSample.dfData = dfPairsToPath(dfData);
    newSample.coeffs = `{${[
      expCoeffs.p0,
      expCoeffs.p1,
      expCoeffs.lambda0,
      expCoeffs.lambda1,
      expCoeffs.c,
    ].join(',')}}`;

    const createdSample = await this.samplesRepository.create(newSample);

    await this.dataUpdateController.createUpdates([
      new DataUpdate({
        bowTypeId: newSample.bow_type_id,
      }),
    ]);

    await this.autoTaggerService.tagSample(newSample);
    return createdSample;
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

  @authenticate.skip()
  @get('/samples/all')
  @response(200, {
    description: 'All samples for comparison',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          properties: {
            sampleId: {
              type: 'number',
            },
            bowTypeId: {
              type: 'number',
            },
            manufacturer: {
              type: 'string',
            },
            modelName: {
              type: 'string',
            },
            nominalPoundage: {type: 'string'},
            submodel: {type: 'string'},
            tagIds: {type: 'array'},
            tagNames: {type: 'array'},
          },
        },
      },
    },
  })
  async getAllSamples(): Promise<object> {
    const allTags = await this.tagsController.find();
    const bowTypeTags = await this.bowTypeTagsController.getAllBowTypeTags();
    const bowTypes = await this.bowTypesController.find();

    const filterBuilder = new FilterBuilder<Samples>();
    const filter = filterBuilder
      .fields('sampleId', 'submodel', 'nominalPoundage', 'bowTypeId')
      .build();
    const samples = await this.find(filter);

    const bowTypeIdToTagIds = bowTypeTags.reduce((acc: any, curr) => {
      if (!acc[curr.bowTypeId]) {
        acc[curr.bowTypeId] = [];
      }
      acc[curr.bowTypeId].push(curr.tagId);
      return acc;
    }, {});

    const tagIdToTagName = allTags.reduce((acc: any, tag) => {
      acc[tag.tagId] = tag.tagName;
      return acc;
    }, {});

    const result = samples.map(sample => {
      const bowType = bowTypes.find(bt => bt.bowTypeId === sample.bowTypeId);

      const sampleTagIds = bowTypeIdToTagIds[sample.bowTypeId] || [];
      const sampleTagNames = sampleTagIds.map(
        (tagId: number) => tagIdToTagName[tagId],
      );

      return {
        bowTypeId: sample.bowTypeId,
        manufacturer: bowType?.manufacturer,
        modelName: bowType?.modelName,
        nominalPoundage: sample.nominalPoundage,
        sampleId: sample.sampleId,
        submodel: sample.submodel,
        tagIds: sampleTagIds,
        tagNames: sampleTagNames,
      };
    });

    return result;
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

  async findWithQuery(filter: Filter<Samples>): Promise<Object> {
    return this.samplesRepository.find(filter);
  }
}
