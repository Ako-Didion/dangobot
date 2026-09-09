import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkCommand } from './commands/link.command';
import { UnlinkCommand } from './commands/unlink.command';
import { WhoAmICommand } from './commands/whoami.command';
import { LinkedAccount } from './entities/linked-account.entity';
import { LinkedGuard } from './guards/linked.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([LinkedAccount])],
  providers: [
    AuthService,
    LinkCommand,
    UnlinkCommand,
    WhoAmICommand,
    { provide: APP_GUARD, useClass: LinkedGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
