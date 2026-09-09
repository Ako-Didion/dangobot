import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SlashCommandContext } from 'necord';
import { LinkedAccountStore } from '../linked-account.store';

export const CurrentLinkedAccount = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const [interaction] = context.getArgByIndex<SlashCommandContext>(0);
    return LinkedAccountStore.get(interaction);
  },
);
