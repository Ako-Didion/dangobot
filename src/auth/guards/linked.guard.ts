import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { SlashCommandContext } from 'necord';
import { SKIP_AUTH_KEY } from '../decorators/skip-auth.decorator';
import { AuthService } from '../auth.service';
import { LinkedAccountStore } from '../linked-account.store';

/**
 * Applied globally (see AuthModule). Only enforces linking on necord command
 * contexts, so it's a no-op for any other context type (e.g. HTTP routes).
 * Use @SkipAuth() to opt a command out (e.g. /link itself).
 */
@Injectable()
export class LinkedGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<'necord'>() !== 'necord') {
      return true;
    }

    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }

    const [interaction] = context.getArgByIndex<SlashCommandContext>(0);

    const linkedAccount = await this.authService.findByDiscordId(
      interaction.user.id,
    );

    if (!linkedAccount) {
      await interaction.reply({
        content:
          "You haven't linked your osu! profile yet. Use `/link <username>` first.",
        flags: ['Ephemeral'],
      });
      return false;
    }

    LinkedAccountStore.set(interaction, linkedAccount);
    return true;
  }
}
