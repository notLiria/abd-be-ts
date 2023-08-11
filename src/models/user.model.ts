import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'users'},
  },
})
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    postgresql: {
      columnName: 'user_id',
      generated: true,
    },
  })
  userId?: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phash: string;

  @property({
    type: 'string',
    required: true,
  })
  salt: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
