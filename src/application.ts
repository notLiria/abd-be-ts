import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  MyUserService,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {AbdBePgsqlDataSource} from './datasources';
import {CachingInterceptor, SentryInterceptor} from './interceptors';
import {AUTOTAGGING_SERVICE, CACHING_SERVICE} from './keys';
import {MySequence} from './sequence';
import {AutoTaggerService} from './services';
import {CachingService} from './services/caching.service';

export {ApplicationConfig};

export class AsiaticBowBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    console.debug(`Connecting with ${process.env.DATABASE_URL}`);
    console.debug(`Using debug setting ${process.env.DEBUG}`);
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    // Configure caching
    this.configure(CACHING_SERVICE).to({ttl: 43200000});
    this.add(createBindingFromClass(CachingService, {key: CACHING_SERVICE}));
    this.add(createBindingFromClass(CachingInterceptor));

    this.add(createBindingFromClass(SentryInterceptor));

    this.add(createBindingFromClass(AutoTaggerService, {key: AUTOTAGGING_SERVICE}));

    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.dataSource(AbdBePgsqlDataSource, UserServiceBindings.DATASOURCE_NAME);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
