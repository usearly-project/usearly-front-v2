import type { UserGroupedReportDescription } from "@src/types/Reports";

export const normalizeDescription = (desc: UserGroupedReportDescription) => ({
  ...desc,
  emoji: desc.emoji ?? undefined,
  capture: desc.capture ?? undefined,

  author: {
    id: desc.author?.id,
    pseudo: desc.author?.pseudo ?? "Utilisateur",
    avatar: desc.author?.avatar ?? undefined,
    email: desc.author?.email ?? undefined,
  },
});
