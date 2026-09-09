import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API } from 'osu-api-v2-js';
import { OSU_API } from './osu-api.constants';

@Global()
@Module({
  providers: [
    {
      provide: OSU_API,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Promise<API> =>
        API.createAsync(
          config.getOrThrow<number>('OSU_CLIENT_ID'),
          config.getOrThrow<string>('OSU_SECRET'),
        ),
    },
  ],
  exports: [OSU_API],
})
export class OsuApiModule {}
