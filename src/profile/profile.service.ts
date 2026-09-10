import { Inject, Injectable } from '@nestjs/common';
import type { API } from 'osu-api-v2-js';
import { OSU_API } from '../osu-api/osu-api.constants';

type OsuUser = Awaited<ReturnType<API['getUser']>>;

@Injectable()
export class ProfileService {
  constructor(
    @Inject(OSU_API)
    private readonly osuApi: API,
  ) {}

  async getUserInformationProfile(userId: number): Promise<OsuUser> {
    return this.osuApi.getUser(userId);
  }
}
