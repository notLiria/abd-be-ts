import {TokenService} from '@loopback/authentication';
import {
  Credentials,
  TokenServiceBindings,
  UserRepository,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {FilterBuilder, model, property, repository} from '@loopback/repository';
import {SchemaObject, post, requestBody} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {hash} from 'bcryptjs';
import {User} from '../models';

@model()
export class NewUser {
  @property({
    type: 'string',
    required: 'true',
    id: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};
export class UserControllerController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const whereBuilder = new FilterBuilder<User>();
    const userWhere = whereBuilder
      .fields('email', 'phash', 'salt', 'userId')
      .where({email: credentials.email})
      .build();
    const user = await this.userRepository.findOne(userWhere);
    if (user) {
      const hashedPassword = await hash(credentials.password, user.salt);
      if (hashedPassword === user.phash) {
        const token = await this.jwtService.generateToken({
          email: credentials.email,
          [securityId]: user.userId,
        });
        return {token};
      }
    }
    return {token: ''};
  }
  /*
  @post('/signup')
  @response(200, {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUser, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUser
  ): Promise<object> {
    const salt = await genSalt()
    const password = await hash(newUserRequest.password, salt);

    const newUser = new User({
      email: newUserRequest.email,
      phash: password,
      salt
    })

    return this.userRepository.create(newUser);
  }
  */
}
