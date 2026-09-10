import { Injectable } from '@nestjs/common';
import { Context, Options, SlashCommand, StringOption } from 'necord';
import type { SlashCommandContext } from 'necord';
import { LinkedAccount } from '../../auth/entities/linked-account.entity';
import { CurrentLinkedAccount } from '../../auth/decorators/linked-account.decorator';
import { ProfileService } from '../profile.service';
import { EmbedBuilder } from 'discord.js';

@Injectable()
export class ProfileCommand {
  constructor(private readonly profileService: ProfileService) {}

  @SlashCommand({
    name: 'profile',
    description: 'Show your osu profile to the world !',
  })
  async onProfile(
    @Context() [interaction]: SlashCommandContext,
    @CurrentLinkedAccount() linkedAccount: LinkedAccount,
  ) {
    try {
      await interaction.deferReply();
      const osuUser = await this.profileService.getUserInformationProfile(
        linkedAccount.osuId,
      );

      const rawAccuracy = osuUser.statistics.accuracy ?? 0;
      const accuracy = rawAccuracy <= 1 ? rawAccuracy * 100 : rawAccuracy;

      const playCount = osuUser.statistics.play_count ?? 0;
      const playHours = Math.round((osuUser.statistics.play_time ?? 0) / 3600);

      const gradeCounts = osuUser.statistics.grade_counts ?? {};

      const gradesLine = [
        gradeCounts.ssh
          ? `<:rank_ssh:1547026972788527114> ${gradeCounts.ssh}`
          : null,
        gradeCounts.ss
          ? `<:rank_ss:1547026898679369868> ${gradeCounts.ss}`
          : null,
        gradeCounts.sh
          ? `<:rank_sh:1547026934288875602> ${gradeCounts.sh}`
          : null,
        gradeCounts.s ? `<:rank_s:1547026863376044033> ${gradeCounts.s}` : null,
        gradeCounts.a ? `<:rank_a:1547026695419072532> ${gradeCounts.a}` : null,
      ]
        .filter((value): value is string => value !== null)
        .join('  ');

      const teamName = osuUser.team?.name ?? 'N/A';
      const teamUrl = osuUser.team?.flag_url ?? null;

      const levelCurrent = osuUser.statistics.level?.current ?? 0;
      const levelProgress = osuUser.statistics.level?.progress ?? 0;

      const description = [
        `▸ **Bancho Rank:** #${osuUser.statistics.global_rank?.toLocaleString() ?? 'N/A'} (${osuUser.country_code}#${osuUser.statistics.country_rank?.toLocaleString() ?? 'N/A'})`,
        `▸ **Level:** ${levelCurrent} + ${levelProgress.toFixed(2)}%`,
        `▸ **PP:** ${osuUser.statistics.pp?.toFixed(2) ?? '0'}  **Acc:** ${accuracy.toFixed(2)}%`,
        `▸ **Playcount:** ${playCount.toLocaleString()} (${playHours} hrs)`,
        gradesLine ? `▸ **Ranks:** ${gradesLine}` : null,
        teamName
          ? `▸ **Team:** \`${teamName}\`${teamUrl ? ` ([link](${teamUrl}))` : ''}`
          : null,
      ]
        .filter(Boolean)
        .join('\n');

      const embed = new EmbedBuilder()
        .setColor(0xff66aa)
        .setAuthor({
          name: `osu! Standard Profile for ${osuUser.username}`,
          iconURL: `https://flagcdn.com/w40/${osuUser.country_code.toLowerCase()}.png`,
          url: `https://osu.ppy.sh/users/${osuUser.id}`,
        })
        .setImage(osuUser.cover.url)
        .setThumbnail(osuUser.avatar_url)
        .setDescription(description)
        .setFooter({
          text: `osu! Profile`,
          iconURL:
            'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/osu.png',
        })
        .setTimestamp(osuUser.last_visit);

      return await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      const notFound =
        (error as { response?: { status_code?: number } })?.response
          ?.status_code === 404;

      return interaction.reply({
        content: notFound
          ? `Could not find an osu! user named "${linkedAccount.osuUsername}".`
          : 'Something went wrong while linking your profile. Please try again later.',
        flags: ['Ephemeral'],
      });
    }
  }
}
