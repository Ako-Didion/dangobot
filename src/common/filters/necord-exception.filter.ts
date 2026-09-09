import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import type { SlashCommandContext } from 'necord';

/**
 * Registered globally (see AppModule) so an exception thrown anywhere in a
 * necord command (guard, pipe, handler) can't crash the whole process as an
 * unhandled rejection on the discord.js Client.
 */
@Catch()
export class NecordExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NecordExceptionFilter.name);

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    if (host.getType<'necord'>() !== 'necord') {
      throw exception;
    }

    // A denying guard (e.g. LinkedGuard) already replied to the interaction.
    if (exception instanceof ForbiddenException) {
      return;
    }

    this.logger.error(exception);

    try {
      const [interaction] = host.getArgByIndex<SlashCommandContext>(0);
      const content = 'Something went wrong while running this command.';

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content });
      } else {
        await interaction.reply({ content, flags: ['Ephemeral'] });
      }
    } catch (replyError) {
      this.logger.error(replyError);
    }
  }
}
