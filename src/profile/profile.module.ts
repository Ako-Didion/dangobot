import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProfileCommand } from './commands/profile.command';
import { ProfileService } from './profile.service';

@Module({
  imports: [AuthModule],
  providers: [ProfileService, ProfileCommand],
})
export class ProfileModule {}
