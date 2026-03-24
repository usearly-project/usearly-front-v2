import type { FeedItem } from "@src/types/feedItem";

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function joinSearchFields(values: Array<string | null | undefined>) {
  return values
    .filter((value): value is string => Boolean(value && value.trim()))
    .join(" ");
}

export function getFeedItemSearchText(item: FeedItem) {
  if (item.type === "report") {
    return joinSearchFields([
      item.data.marque,
      item.data.subCategory,
      item.data.description,
      item.data.author?.pseudo,
      item.data.hasBrandResponse?.message,
      ...item.data.reporters.flatMap((reporter) => [
        reporter.pseudo,
        reporter.description,
      ]),
    ]);
  }

  return joinSearchFields([
    item.data.marque,
    item.data.title,
    item.data.punchline,
    item.data.description,
    item.data.author?.pseudo,
  ]);
}

export function filterFeedItems(items: FeedItem[], query: string) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    normalizeSearchValue(getFeedItemSearchText(item)).includes(normalizedQuery),
  );
}
