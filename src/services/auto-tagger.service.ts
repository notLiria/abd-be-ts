import { /* inject, */ BindingScope, injectable} from '@loopback/core';

import {inject} from '@loopback/context';
import {BowTypeTagsController, TagController} from '../controllers';

import debugFactory from 'debug';
import {BowTypeTags, Samples} from '../models';
const debug = debugFactory('autoTagging');
interface AutoTaggableTag {
  tagName: string;
  condition: (sample: SampleWithoutId) => boolean;
}
interface AutoTaggableTagWithId extends AutoTaggableTag {
  tagId: number;
}

type SampleWithoutId = Omit<Samples, 'sampleId'>;

const autoTaggableTags = [
  {
    tagName: 'small bow',
    condition: (sample: SampleWithoutId) =>
      sample.strungLength <= 125 && sample.strungLength > 0,
  },
  {
    tagName: 'medium bow',
    condition: (sample: SampleWithoutId) =>
      sample.strungLength > 125 && sample.strungLength <= 139,
  },
  {
    tagName: 'large bow',
    condition: (sample: SampleWithoutId) => sample.strungLength > 139,
  },
  {
    tagName: 'short draw length',
    condition: (sample: SampleWithoutId) =>
      sample.maxDraw <= 29 && sample.maxDraw > 0,
  },
  {
    tagName: 'medium draw length',
    condition: (sample: SampleWithoutId) =>
      sample.maxDraw > 29 && sample.maxDraw < 32,
  },
  {
    tagName: 'long draw length',
    condition: (sample: SampleWithoutId) => sample.maxDraw > 32,
  },
  {
    tagName: 'longbow point',
    condition: (sample: SampleWithoutId) => sample.longbowPoint > 0,
  },
];

@injectable({scope: BindingScope.TRANSIENT})
export class AutoTaggerService {
  constructor(
    @inject('controllers.BowTypeTagsController')
    private bowTypeTagsController: BowTypeTagsController,
    @inject('controllers.TagController')
    private tagController: TagController,
  ) {}

  async tagSample(input: SampleWithoutId) {
    const listOfTags: {[key: string]: number} = (
      await this.tagController.find()
    ).reduce((prev, cur) => {
      return {
        ...prev,
        [cur.tagName]: cur.tagId,
      };
    }, {});

    const autoTaggableTagsWithIds = autoTaggableTags.reduce<
      AutoTaggableTagWithId[]
    >((prev, cur) => {
      return [...prev, {...cur, tagId: listOfTags[cur.tagName]}];
    }, []);

    const applicableTagIds = autoTaggableTagsWithIds
      .map(tag => (tag.condition(input) ? tag.tagId : undefined))
      .filter(x => x !== undefined);

    autoTaggableTagsWithIds.forEach(tag => {
      debug(`Checking condition for ${tag.tagName}: ${tag.condition(input)}`);
    });

    const applicableTags = applicableTagIds.map(async tagId => {
      try {
        return await this.bowTypeTagsController.create(
          new BowTypeTags({
            bowTypeId: input.bowTypeId,
            tagId,
          }),
        );

  } catch(e) {
    debug(`Error in autotagging`)
    debug(e)
  }});
      return Promise.all(applicableTags)
  }
}
