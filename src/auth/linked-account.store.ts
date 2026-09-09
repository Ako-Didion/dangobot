import { RepliableInteraction } from 'discord.js';
import { LinkedAccount } from './entities/linked-account.entity';

const store = new WeakMap<RepliableInteraction, LinkedAccount>();

export const LinkedAccountStore = {
  set: (interaction: RepliableInteraction, account: LinkedAccount): void => {
    store.set(interaction, account);
  },
  get: (interaction: RepliableInteraction): LinkedAccount | undefined =>
    store.get(interaction),
};
