export const getSafeNumber = (value: unknown) => {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : 0;

  return Number.isFinite(numberValue) ? numberValue : 0;
};

export const getReactionTotal = (
  reactions?: Array<{ count?: number; userIds?: string[] }>,
) =>
  (reactions ?? []).reduce(
    (sum, reaction) => sum + (reaction.count ?? reaction.userIds?.length ?? 0),
    0,
  );

export const LAST_24_HOURS_IN_MS = 24 * 60 * 60 * 1000;
export const LAST_48_HOURS_IN_MS = 48 * 60 * 60 * 1000;

export const isCreatedInLast24h = (date: string) => {
  const createdAt = new Date(date).getTime();
  return (
    !Number.isNaN(createdAt) && createdAt >= Date.now() - LAST_24_HOURS_IN_MS
  );
};
