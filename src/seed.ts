import { NestFactory } from '@nestjs/core';
import { SeederModule } from './modules/seeder.module';
import { UserSeeder } from '../db/seeds/user.seeder'; //'db/seeds/user.seeder';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  try {
    const seeder = appContext.get(UserSeeder);
    await seeder.seed();
  } catch (e) {
    console.error('Ошибка сидинга', e);
    process.exitCode = 1;
  } finally {
    await appContext.close();
  }
}

void bootstrap();
