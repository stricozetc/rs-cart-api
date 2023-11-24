import { NestFactory } from '@nestjs/core';
import { createServer, proxy } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';

let server: ReturnType<typeof createServer>;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  server = createServer(expressApp);
}

export const handler: Handler = async (
    event: any,
    context: Context,
) => {
  if (!server) {
    await bootstrap();
  }
  return proxy(server, event, context, 'PROMISE').promise;
};
