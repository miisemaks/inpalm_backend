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
            // {
            //   messages: {
            //     welcomeOnBoard: 'Добро пожаловать в панель управления Inpalm',
            //     noRecords: 'Нет записей для отображения',
            //     noRecordsInResource:
            //       'Нет записей для отображения в этом ресурсе',
            //     componentNotFound_subtitle:
            //       'Компонент не найден, пожалуйста, обратитесь в службу поддержки',
            //     pageNotFound_subtitle:
            //       'Страница не найдена, пожалуйста, обратитесь в службу поддержки',
            //   },
            //   actions: {
            //     new: 'Создать',
            //     edit: 'Редактировать',
            //     show: 'Показать',
            //     delete: 'Удалить',
            //     bulkDelete: 'Удалить выбранные',
            //     list: 'Список',
            //   },
            //   buttons: {
            //     save: 'Сохранить',
            //     addNewItem: 'Добавить новый элемент',
            //     filter: 'Фильтр',
            //     filterActive: 'Активные фильтры',
            //     applyChanges: 'Применить',
            //     resetFilter: 'Сбросить фильтр',
            //     confirmRemovalMany:
            //       'Вы уверены, что хотите удалить эти {{count}} записей?',
            //     confirmRemovalMany_plural:
            //       'Вы уверены, что хотите удалить эти {{count}} записи?',
            //     confirmRemoval: 'Вы уверены, что хотите удалить эту запись?',
            //     logout: 'Выйти',
            //     login: 'Войти',
            //     seeTheDocumentation: 'Посмотреть документацию',
            //     createFirstRecord: 'Создать первую запись',
            //     cancel: 'Отмена',
            //     confirm: 'Подтвердить',
            //     contactUs: 'Связаться с нами',
            //   },
            //   labels: {
            //     navigation: 'Навигация',
            //     pages: 'Страницы',
            //     selectedRecords: 'Выбранные записи',
            //     filters: 'Фильтры',
            //     adminVersion: 'Версия AdminJS: {{version}}',
            //     appVersion: 'Версия приложения: {{version}}',
            //     dashboard: 'Панель управления',
            //   },
            //   properties: {
            //     length: 'Длина',
            //     from: 'От',
            //     to: 'До',
            //   },
            //   components: {
            //     DropZone: {
            //       placeholder:
            //         'Перетащите файлы сюда или нажмите, чтобы выбрать',
            //       acceptedSize: 'Макс. размер файла: {{size}}',
            //       acceptedType: 'Допустимые типы файлов: {{types}}',
            //       insupportedSize: 'Недопустимый размер файла',
            //       unsupportedType: 'Недопустимый тип файла',
            //     },
            //     Login: {
            //       welcomeHeader: 'Добро пожаловать в панель управления Inpalm',
            //       welcomeMessage: 'Пожалуйста, войдите, чтобы продолжить',
            //       loginButton: 'Войти',
            //       properties: {
            //         email: 'Электронная почта',
            //         password: 'Пароль',
            //       },
            //     },
            //   },
            //   resources: {
            //     User: {
            //       properties: {
            //         email: 'Электронная почта',
            //         firstName: 'Имя',
            //         lastName: 'Фамилия',
            //         role: 'Роль',
            //         password: 'Пароль',
            //         Id: 'ID',
            //         birthdate: 'Дата рождения',
            //         avatar: 'Аватар',
            //         createdAt: 'Дата создания',
            //         updatedAt: 'Дата обновления',
            //       },
            //     },
            //   },
            // },
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
                    async (res: ActionResponse, req: ActionRequest) => {
                      await authService.create(
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                        res.record.params._id,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        req.payload?.password,
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
        authenticate: async (email: string, password: string) => {
          return authService.validateAdmin(email, password);
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
});
