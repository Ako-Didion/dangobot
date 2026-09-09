import { Injectable } from '@nestjs/common';
import { Context, Options, SlashCommand, StringOption } from 'necord';
import type { SlashCommandContext } from 'necord';
import { SkipAuth } from '../decorators/skip-auth.decorator';
import { AuthService } from '../auth.service';

class LinkDto {
  @StringOption({
    name: 'username',
    description: 'Your osu! username',
    required: true,
  })
  username: string;
}

@Injectable()
export class LinkCommand {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @SlashCommand({
    name: 'link',
    description: 'Link your Discord account to your osu! profile',
  })
  async onLink(
    @Context() [interaction]: SlashCommandContext,
    @Options() { username }: LinkDto,
  ) {
    try {
      const account = await this.authService.link(
        interaction.user.id,
        username,
      );

      return interaction.reply({
        content: `Linked your Discord account to osu! profile **${account.osuUsername}**.`,
        flags: ['Ephemeral'],
      });
    } catch (error) {
      const notFound =
        (error as { response?: { status_code?: number } })?.response
          ?.status_code === 404;

      return interaction.reply({
        content: notFound
          ? `Could not find an osu! user named "${username}".`
          : 'Something went wrong while linking your profile. Please try again later.',
        flags: ['Ephemeral'],
      });
    }
  }
}
