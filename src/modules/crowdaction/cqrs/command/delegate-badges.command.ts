import { Injectable } from '@nestjs/common';
import { ICommand, ICQRSHandler } from '@common/cqrs';
import { ICrowdAction } from '@domain/crowdaction';
import { AwardTypeEnum, Badge, BadgeTierEnum } from '@domain/badge';
import { ListParticipationsForCrowdActionQuery } from '@modules/participation';
import { CommitmentOption } from '@domain/commitmentoption';
import { AwardBadgesCommand } from '@modules/profile/cqrs';

interface AwardThreshold {
    readonly diamondThreshold: number;
    readonly goldThreshold: number;
    readonly silverThreshold: number;
    readonly bronzeThreshold: number;
}

@Injectable()
export class DelegateBadgesCommand implements ICommand {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    async execute(crowdAction: ICrowdAction): Promise<any> {
        if (crowdAction.badges?.length) {
            // Get Thresholds for the CrowdAction
            const thresholds: AwardThreshold = getThresholds(crowdAction.commitmentOptions);

            const participantList = await this.cqrsHandler.fetch(ListParticipationsForCrowdActionQuery, {
                filter: { crowdActionId: crowdAction.id },
            });

            let pageInfo = participantList.pageInfo;
            let participants = participantList.items;

            // Iterate paginated list of participants
            for (let page = 1; page <= pageInfo.totalPages; page++) {
                // Iterate current items of Participants
                for (const participant of participants) {
                    // Iterate badges of current participant
                    const awardedBadges: Badge[] = [];
                    for (const badge of crowdAction.badges) {
                        if (participant.dailyCheckIns >= badge.minimumCheckIns) {
                            if (badge.awardType === AwardTypeEnum.ALL) {
                                awardedBadges.push(badge);
                                continue;
                            }

                            // If Participant was already awarded a Tiered badge, continue
                            if (awardedBadges.length && awardedBadges.some((b) => b.awardType === AwardTypeEnum.TIER)) {
                                continue;
                            }

                            const commitments = crowdAction.commitmentOptions.filter((c) => participant.commitmentOptions.includes(c.id));
                            const points = commitments.reduce((acc, cur) => acc + cur.points, 0);

                            if (badge.tier === BadgeTierEnum.DIAMOND && points >= thresholds.diamondThreshold) {
                                awardedBadges.push(badge);
                            } else if (badge.tier === BadgeTierEnum.GOLD && points >= thresholds.goldThreshold) {
                                awardedBadges.push(badge);
                            } else if (badge.tier === BadgeTierEnum.SILVER && points >= thresholds.silverThreshold) {
                                awardedBadges.push(badge);
                            } else if (badge.tier === BadgeTierEnum.BRONZE && points >= thresholds.bronzeThreshold) {
                                awardedBadges.push(badge);
                            }
                        }
                    }

                    if (awardedBadges.length) {
                        this.cqrsHandler.execute(AwardBadgesCommand, { userId: participant.userId, badges: awardedBadges });
                    }
                }

                // If there is a next page, fetch it
                if (pageInfo.totalPages > pageInfo.page) {
                    const result = await this.cqrsHandler.fetch(ListParticipationsForCrowdActionQuery, {
                        filter: { crowdActionId: crowdAction.id },
                        page: pageInfo.page + 1,
                    });

                    pageInfo = result.pageInfo;
                    participants = result.items;
                } else {
                    participants = [];
                }
            }
        }
    }
}

function getThresholds(options: CommitmentOption[]): AwardThreshold {
    const diamondThreshold = options.sort((a, b) => b.points - a.points)[0].points; // 100%
    const goldThreshold = (diamondThreshold / 100) * 75; // 75%
    const silverThreshold = (diamondThreshold / 100) * 50; // 50%
    const bronzeThreshold = (diamondThreshold / 100) * 25; // 25%

    return { diamondThreshold, goldThreshold, silverThreshold, bronzeThreshold };
}
