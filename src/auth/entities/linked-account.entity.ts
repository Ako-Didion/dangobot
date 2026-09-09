import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('linked_accounts')
export class LinkedAccount {
  @PrimaryColumn({ name: 'discord_id' })
  discordId: string;

  @Column({ name: 'osu_id' })
  osuId: number;

  @Column({ name: 'osu_username' })
  osuUsername: string;

  @CreateDateColumn({ name: 'linked_at' })
  linkedAt: Date;
}
