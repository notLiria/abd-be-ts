/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  FilterBuilder,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';

import AWS, {S3} from 'aws-sdk';
import md5 from 'md5';
import multer from 'multer';
import stream from 'stream';
import {BowPicture, Samples} from '../models';
import {BowPictureRepository} from '../repositories';
import {SampleController} from './sample.controller';
const {Duplex} = stream;

function bufferToStream(buffer: any) {
  const duplexStream = new Duplex();
  duplexStream.push(buffer);
  duplexStream.push(null);
  return duplexStream;
}

const s3BucketName = process.env.S3_BUCKET_NAME ?? 'asiatic-bow-database';

export class BowPicturesController {
  private s3: S3;
  constructor(
    @inject('controllers.SampleController')
    private sampleController: SampleController,
    @repository(BowPictureRepository)
    public bowPictureRepository: BowPictureRepository,
  ) {
    if (process.env.S3_UPLOAD_ENABLE) {
      const s3Config = {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      };
      this.s3 = new AWS.S3(s3Config);
    }
  }

  @authenticate('jwt')
  @post('/bow-pictures')
  @response(200, {
    description: 'BowPicture model instance',
    content: {'application/json': {schema: getModelSchemaRef(BowPicture)}},
  })
  async uploadBowPicture(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              descriptions: {
                type: 'array',
              },
              bowTypeId: {
                type: 'string',
              },
              sampleId: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) uploadResponse: Response,
  ): Promise<Object> {
    if (!process.env.S3_UPLOAD_ENABLE) {
      throw new HttpErrors.Forbidden(
        'S3 Uploading is disabled on this environment',
      );
    }
    return new Promise<BowPicture[]>((resolve, reject) => {
      const storage = multer.memoryStorage();
      const upload = multer({storage});

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      upload.any()(request, uploadResponse, async (err: any) => {
        if (err) reject(err);
        else {
          const descriptionKeys = Object.keys(request.body).filter(key =>
            key.startsWith('descriptions_'),
          );

          // Sorting the keys by their index
          const sortedKeys = descriptionKeys.sort((a, b) => {
            const indexA = parseInt(a.split('_')[1], 10);
            const indexB = parseInt(b.split('_')[1], 10);
            return indexA - indexB;
          });

          // Creating an array based on the sorted keys
          const descriptionArray = sortedKeys.map(key => {
            return request.body[key];
          });

          const newDbEntries = [];
          for (const file of (request as any).files) {
            const index = parseFloat(file.fieldname.split('_')[1]);
            const extension = file.originalname.split('.')[1];
            const fileKey = `${md5(
              `${file.originalname}${Date.now()}`,
            )}.${extension}`;
            const params = {
              Bucket: s3BucketName,
              Key: fileKey,
              Body: bufferToStream(file.buffer),
            };
            try {
              console.debug(`Uploading ${fileKey} to S3`);
              const stored = await this.s3.upload(params).promise();
              console.debug(
                `Upload completed with results ${JSON.stringify(stored)}`,
              );
              const newDbEntry = new BowPicture({
                pictureLink: fileKey,
                bowTypeId: request.body.bowTypeId,
                sampleId: request.body.sampleId,
                caption: descriptionArray[index],
              });
              newDbEntries.push(newDbEntry);
            } catch (error) {
              reject(error);
            }
          }
          const createdEntries = await this.bowPictureRepository.createAll(
            newDbEntries,
          );
          resolve(createdEntries);
        }
      });
    });
  }

  @get('/bow-pictures/count')
  @response(200, {
    description: 'BowPicture model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(BowPicture) where?: Where<BowPicture>,
  ): Promise<Count> {
    return this.bowPictureRepository.count(where);
  }

  @get('/bow-pictures/bow_type_id/{bow_type_id}')
  @response(200, {
    description: 'Search for bow pictures by bow type id instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BowPicture, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('bow_type_id') bowTypeId: number,
    @param.filter(BowPicture, {exclude: 'where'})
    filter?: FilterExcludingWhere<BowPicture>,
  ): Promise<Object[]> {
    const filterBuilder = new FilterBuilder<BowPicture>();
    const bowTypeIdFilter = filterBuilder.where({bowTypeId}).build();
    const pictures = await this.bowPictureRepository.find(bowTypeIdFilter);
    const samplesWithSubmodels = (
      (await this.sampleController.findWithQuery({
        fields: ['submodel', 'sampleId'],
        where: {bowTypeId},
      })) as Samples[]
    ).reduce((accumulator: any, sample: Samples) => {
      accumulator[sample.sampleId] = sample.submodel;
      return accumulator;
    }, {});
    const picturesWithSubmodels = pictures.map(picture => {
      return {
        ...picture,
        pictureLink: `http://${s3BucketName}.s3.amazonaws.com/${picture.pictureLink}`,
        submodel: samplesWithSubmodels[picture.sampleId],
      };
    });
    return picturesWithSubmodels;
  }
}
