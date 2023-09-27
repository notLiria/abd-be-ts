import { /* inject, */ BindingScope, injectable} from '@loopback/core';

import {inject} from '@loopback/context';
import {BowTypeTagsController, TagController} from '../controllers';

import {BowTypeTags, Samples} from '../models';

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
      sample.strungLength > 125 && sample.strungLength <= 136,
  },
  {
    tagName: 'large bow',
    condition: (sample: SampleWithoutId) => sample.strungLength > 140,
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
      console.log(`Checking condition for ${tag.tagName}`);
      console.log(`Condition returned ${tag.condition(input)}`);
    });

    await Promise.all(
      applicableTagIds.map(async tagId => {
        return this.bowTypeTagsController.create(
          new BowTypeTags({
            bowTypeId: input.bowTypeId,
            tagId,
          }),
        );
      }),
    );
  }
}
