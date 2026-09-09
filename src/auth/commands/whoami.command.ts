import { Injectable } from '@nestjs/common';
import { Context, SlashCommand } from 'necord';
import type { SlashCommandContext } from 'necord';
import { CurrentLinkedAccount } from '../decorators/linked-account.decorator';
import { LinkedAccount } from '../entities/linked-account.entity';

@Injectable()
export class WhoAmICommand {
  @SlashCommand({
    name: 'whoami',
    description: 'Show the osu! profile linked to your Discord account',
  })
  async onWhoAmI(
    @Context() [interaction]: SlashCommandContext,
    @CurrentLinkedAccount() linkedAccount: LinkedAccount,
  ) {
    return interaction.reply({
      content: `You're linked to osu! profile **${linkedAccount.osuUsername}**.`,
      flags: ['Ephemeral'],
    });
  }
}
