export const XP_RULES = {
  correct_first_attempt: 10,
  correct_second_attempt: 5,
  streak_bonus_3: 15,
  streak_bonus_5: 25,
} as const;

export function calcXP(params: {
  correct: boolean;
  attempt: number;
  streak: number;
}): number {
  if (!params.correct) return 0;

  let xp =
    params.attempt === 1
      ? XP_RULES.correct_first_attempt
      : XP_RULES.correct_second_attempt;

  if (params.streak === 3) xp += XP_RULES.streak_bonus_3;
  if (params.streak === 5) xp += XP_RULES.streak_bonus_5;

  return xp;
}
