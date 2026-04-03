import AdminJS, { ActionRequest, ActionResponse } from 'adminjs';
import '@adminjs/express';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module.js';
import { AuthService } from '../auth/auth.service.js';
import { dark, light } from '@adminjs/themes';
import { User } from '../user/user.schema.js';
import { Publication } from '../publication/publication.schema.js';
import ru from './admin.locale.ru.json' with { type: 'json' };

AdminJS.registerAdapter({ Database, Resource });

export default AdminModule.createAdminAsync({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'JWT_SECRET',
        signOptions: {
          expiresIn: +configService.get<string>('JWT_EXPIRES_IN', '24'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  inject: [AuthService],
  useFactory: (authService: AuthService) => {
    return {
      adminJsOptions: {
        settings: {
          defaultPerPage: 20,
        },
        branding: {
          companyName: 'inpalm',
        },
        rootPath: '/admin',
        defaultTheme: dark.id,
        availableThemes: [dark, light],
        locale: {
          language: 'ru',
          availableLanguages: ['ru', 'en'],
          localeDetection: true,
          translations: {
            ru: ru,
          },
        },
        resources: [
          {
            resource: User,
            options: {
              navigation: {
                name: 'User',
                icon: 'User',
              },
              properties: {
                password: {
                  type: 'string',
                },
              },
              listProperties: ['email', 'firstName', 'lastName', 'role'],
              actions: {
                new: {
                  after: [
                    async (
                      res: ActionResponse,
                      req: ActionRequest,
                    ): Promise<ActionResponse> => {
                      await authService.create(
                        res.record.params._id as string,
                        req.payload?.password as string,
                      );
                      return res;
                    },
                  ],
                },
              },
            },
          },
          {
            resource: Publication,
          },
        ],
      },
      auth: {
        authenticate: async (
          email: string,
          password: string,
        ) => {
          return authService.validateAdmin(email, password) as any;
        },
        cookieName: 'adminjs',
        cookiePassword: 'secret',
      },
      sessionOptions: {
        resave: true,
        saveUninitialized: true,
        secret: 'secret',
      },
    };
  },
} as any);
