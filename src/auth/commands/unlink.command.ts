import { Injectable } from '@nestjs/common';
import { Context, SlashCommand } from 'necord';
import type { SlashCommandContext } from 'necord';
import { CurrentLinkedAccount } from '../decorators/linked-account.decorator';
import { LinkedAccount } from '../entities/linked-account.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class UnlinkCommand {
  constructor(private readonly authService: AuthService) {}

  @SlashCommand({
    name: 'unlink',
    description: 'Unlink the osu! profile linked to your Discord account',
  })
  async onUnlink(
    @Context() [interaction]: SlashCommandContext,
    @CurrentLinkedAccount() linkedAccount: LinkedAccount,
  ) {
    await this.authService.unlink(linkedAccount.discordId);

    return interaction.reply({
      content: `Unlinked your Discord account from osu! profile **${linkedAccount.osuUsername}**.`,
      flags: ['Ephemeral'],
    });
  }
}
