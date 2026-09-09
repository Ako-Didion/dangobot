import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { API } from 'osu-api-v2-js';
import { Repository } from 'typeorm';
import { OSU_API } from '../osu-api/osu-api.constants';
import { LinkedAccount } from './entities/linked-account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LinkedAccount)
    private readonly linkedAccounts: Repository<LinkedAccount>,
    @Inject(OSU_API)
    private readonly osuApi: API,
  ) {}

  findByDiscordId(discordId: string): Promise<LinkedAccount | null> {
    return this.linkedAccounts.findOneBy({ discordId });
  }

  async link(discordId: string, osuUsername: string): Promise<LinkedAccount> {
    const osuUser = await this.osuApi.getUser(osuUsername);

    const linkedAccount = this.linkedAccounts.create({
      discordId,
      osuId: osuUser.id,
      osuUsername: osuUser.username,
    });

    return this.linkedAccounts.save(linkedAccount);
  }

  async unlink(discordId: string): Promise<boolean> {
    const result = await this.linkedAccounts.delete({ discordId });
    return !!result.affected;
  }
}
